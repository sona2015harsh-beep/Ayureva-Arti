import { prisma } from "../lib/prisma"
import { createConsultationRazorpayOrder, verifyConsultationPayment } from "../actions/booking-payment"
import { createConsultationPaypalOrder, verifyAndCapturePaypalPayment } from "../actions/paypal-payment"

// Store native fetch
const originalFetch = global.fetch

interface MockResponse {
  url: string
  method?: string
  status: number
  json: () => Promise<any>
}

// Setup global fetch mock router to simulate Razorpay/PayPal & Resend notifications
function setupFetchMock(scenario: { currency: string; amount: number; orderId: string }) {
  global.fetch = async (url: string | URL | Request, options?: RequestInit): Promise<Response> => {
    const urlStr = url.toString()
    
    // 1. PayPal Access Token Mock
    if (urlStr.includes("/v1/oauth2/token")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ access_token: "mock_paypal_access_token_abc123" }),
        text: async () => JSON.stringify({ access_token: "mock_paypal_access_token_abc123" }),
      } as Response
    }

    // 2. PayPal Order Creation Mock
    if (urlStr.includes("/v2/checkout/orders") && !urlStr.includes("/capture")) {
      return {
        ok: true,
        status: 201,
        json: async () => ({ id: scenario.orderId }),
        text: async () => JSON.stringify({ id: scenario.orderId }),
      } as Response
    }

    // 3. PayPal Order Capture Mock
    if (urlStr.includes(`/v2/checkout/orders/${scenario.orderId}/capture`)) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          status: "COMPLETED",
          purchase_units: [
            {
              payments: {
                captures: [
                  {
                    amount: {
                      value: scenario.amount.toString(),
                      currency_code: scenario.currency,
                    },
                  },
                ],
              },
            },
          ],
        }),
        text: async () => JSON.stringify({ status: "COMPLETED" }),
      } as Response
    }

    // 4. Resend email notifications Mock
    if (urlStr.includes("api.resend.com/emails")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ id: "mock_resend_email_id_xyz" }),
      } as Response
    }

    // Fallback to original fetch for other internal requests
    return originalFetch(url, options)
  }
}

function restoreFetch() {
  global.fetch = originalFetch
}

async function runTests() {
  console.log("🚀 STARTING SPRINT A: CONVERSION ASSURANCE VERIFICATION SUITE...\n")

  // Cleanup past leftovers if any
  await prisma.leads.deleteMany({
    where: { phone_number: { startsWith: "+999999" } }
  })
  await prisma.patients.deleteMany({
    where: { phone: { startsWith: "+999999" } }
  })

  // Define testing scenarios representing all supported international markets & domestic INR
  const testMatrix = [
    {
      name: "India (Domestic)",
      country: "IN",
      phone: "+9999990001",
      checkoutCurrency: "INR",
      visualPrice: 500,
      expectedCurrency: "INR",
      expectedAmount: 500,
      gateway: "razorpay",
      isRecovered: false,
    },
    {
      name: "United States",
      country: "US",
      phone: "+9999990002",
      checkoutCurrency: "USD",
      visualPrice: 99,
      expectedCurrency: "USD",
      expectedAmount: 99,
      gateway: "paypal",
      isRecovered: true, // Mark this lead as triggered by recovery emails to assert stats tracking
    },
    {
      name: "United Kingdom",
      country: "GB",
      phone: "+9999990003",
      checkoutCurrency: "GBP",
      visualPrice: 79,
      expectedCurrency: "GBP",
      expectedAmount: 79,
      gateway: "paypal",
      isRecovered: false,
    },
    {
      name: "Canada",
      country: "CA",
      phone: "+9999990004",
      checkoutCurrency: "USD",
      visualPrice: 99,
      expectedCurrency: "USD",
      expectedAmount: 99,
      gateway: "paypal",
      isRecovered: true,
    },
    {
      name: "Australia",
      country: "AU",
      phone: "+9999990005",
      checkoutCurrency: "USD",
      visualPrice: 99,
      expectedCurrency: "USD",
      expectedAmount: 99,
      gateway: "paypal",
      isRecovered: false,
    },
    {
      name: "United Arab Emirates",
      country: "AE",
      phone: "+9999990006",
      checkoutCurrency: "AED",
      visualPrice: 249,
      expectedCurrency: "USD", // PayPal fallback currency
      expectedAmount: 68,     // converted roughly (249 / 3.67)
      gateway: "paypal",
      isRecovered: false,
    },
  ]

  let passed = 0
  let failed = 0

  for (const scenario of testMatrix) {
    console.log(`--------------------------------------------------`)
    console.log(`TEST SCENARIO: ${scenario.name} (${scenario.country})`)
    console.log(`  Gateway: ${scenario.gateway.toUpperCase()} | Price: ${scenario.visualPrice} ${scenario.checkoutCurrency}`)
    console.log(`--------------------------------------------------`)

    try {
      const mockLeadId = `test_lead_${scenario.country.toLowerCase()}`
      const mockOrderId = `order_${scenario.gateway}_${scenario.country.toLowerCase()}_${Date.now()}`
      
      // 1. Create Lead in database
      const lead = await prisma.leads.create({
        data: {
          full_name: `Test Patient ${scenario.country}`,
          email: `test_${scenario.country.toLowerCase()}@ayureva.in`,
          phone_number: scenario.phone,
          message: `Testing checkout flow for ${scenario.country}`,
          status: "pending",
          recovery_status: "not_started",
          recovery_emails_sent: scenario.isRecovered ? 2 : 0,
          source: "google",
        }
      })

      // Set environment variables for OAuth tests if missing
      process.env.PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "rzp_test_mock_key_id"
      process.env.PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "rzp_test_mock_secret"

      // 2. Setup mock fetch routes for this loop
      setupFetchMock({
        currency: scenario.expectedCurrency,
        amount: scenario.expectedAmount,
        orderId: mockOrderId,
      })

      // 3. Initiate Checkout Order Creation
      console.log(`  ➔ Initiating checkout order...`)
      let activeOrderId = mockOrderId
      if (scenario.gateway === "razorpay") {
        const rzpOrder = await createConsultationRazorpayOrder(lead.id, scenario.visualPrice)
        if (!rzpOrder.success || !rzpOrder.orderId) {
          throw new Error(`Razorpay Order creation failed: ${JSON.stringify(rzpOrder)}`)
        }
        activeOrderId = rzpOrder.orderId
        console.log(`    ✓ Razorpay Order Created: ${rzpOrder.orderId}`)
      } else {
        const paypalOrder = await createConsultationPaypalOrder(lead.id, scenario.visualPrice, scenario.checkoutCurrency)
        if (!paypalOrder.success || !paypalOrder.orderId) {
          throw new Error(`PayPal Order creation failed: ${JSON.stringify(paypalOrder)}`)
        }
        activeOrderId = paypalOrder.orderId
        console.log(`    ✓ PayPal Order Created: ${paypalOrder.orderId}`)
      }

      // 4. Simulate payment gateway verification / capture webhook
      console.log(`  ➔ Simulating payment capture webhook...`)
      if (scenario.gateway === "razorpay") {
        const paymentId = `pay_rzp_${Date.now()}`
        const secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_mock_secret"
        const body = activeOrderId + "|" + paymentId
        const crypto = require("crypto")
        const signature = crypto
          .createHmac("sha256", secret)
          .update(body)
          .digest("hex")

        const verifyRes = await verifyConsultationPayment(
          lead.id,
          activeOrderId, // Order ID
          paymentId, // Payment ID
          signature // Signature
        )
        if (!verifyRes.success) {
          throw new Error(`Razorpay payment verification failed: ${verifyRes.message}`)
        }
      } else {
        const verifyRes = await verifyAndCapturePaypalPayment(lead.id, activeOrderId)
        if (!verifyRes.success) {
          throw new Error(`PayPal payment capture failed: ${verifyRes.message}`)
        }
      }
      console.log(`    ✓ Payment Capture Signal Successful`)

      // 5. Query updated CRM database state
      console.log(`  ➔ Verifying database CRM state...`)
      const updatedLead = await prisma.leads.findUnique({
        where: { id: lead.id }
      })

      if (!updatedLead) throw new Error("Lead missing from database after update")
      
      // Assertions
      if (updatedLead.status !== "paid") {
        throw new Error(`Assertion failed: lead status is '${updatedLead.status}', expected 'paid'`)
      }
      if (updatedLead.recovery_status !== "completed") {
        throw new Error(`Assertion failed: recovery_status is '${updatedLead.recovery_status}', expected 'completed'`)
      }
      if (updatedLead.payment_currency !== scenario.expectedCurrency) {
        throw new Error(`Assertion failed: payment_currency is '${updatedLead.payment_currency}', expected '${scenario.expectedCurrency}'`)
      }
      if (Math.round(updatedLead.payment_amount || 0) !== Math.round(scenario.expectedAmount)) {
        throw new Error(`Assertion failed: payment_amount is ${updatedLead.payment_amount}, expected ${scenario.expectedAmount}`)
      }
      if (updatedLead.recovered_by_email !== scenario.isRecovered) {
        throw new Error(`Assertion failed: recovered_by_email is ${updatedLead.recovered_by_email}, expected ${scenario.isRecovered}`)
      }
      console.log(`    ✓ Lead state variables assert successfully.`)

      // 6. Assert CRM Patient auto-linking
      if (!updatedLead.patient_id) {
        throw new Error("Assertion failed: patient_id is null, patient record was not linked/created.")
      }
      
      const patient = await prisma.patients.findUnique({
        where: { id: updatedLead.patient_id }
      })
      if (!patient) {
        throw new Error(`Assertion failed: patient record with ID ${updatedLead.patient_id} does not exist in patients table.`)
      }
      if (patient.phone !== scenario.phone) {
        throw new Error(`Assertion failed: patient phone ${patient.phone} does not match lead phone ${scenario.phone}`)
      }
      console.log(`    ✓ CRM Patient Linked & Verified: ID ${patient.id.substring(0,8)}...`)

      passed++
      console.log(`🟢 SCENARIO PASSED: ${scenario.name}\n`)
    } catch (err: any) {
      console.error(`🔴 SCENARIO FAILED: ${scenario.name}`)
      console.error(`   Error details: ${err.message}\n`)
      failed++
    } finally {
      restoreFetch()
    }
  }

  // Cleanup Database
  console.log("🧹 Cleaning up mock test records from database...")
  await prisma.leads.deleteMany({
    where: { phone_number: { startsWith: "+999999" } }
  })
  await prisma.patients.deleteMany({
    where: { phone: { startsWith: "+999999" } }
  })
  console.log("🧹 Cleanup done.")

  console.log(`\n==================================================`)
  console.log(`TEST SUMMARY:`)
  console.log(`  PASSED: ${passed}`)
  console.log(`  FAILED: ${failed}`)
  console.log(`==================================================`)

  if (failed > 0) {
    process.exit(1)
  } else {
    console.log("🎉 ALL SPRINT A CONVERSION SCENARIOS ASSERTED PERFECTLY!")
    process.exit(0)
  }
}

runTests().catch((err) => {
  console.error("Fatal test execution error:", err)
  process.exit(1)
})
