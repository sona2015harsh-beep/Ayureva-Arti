"use server"

import { prisma } from "@/lib/prisma"

const getPaypalBaseUrl = () => {
  return process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com"
}

// Helper to get OAuth2 Access Token from PayPal
async function getPaypalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("PayPal Client ID or Secret is not configured in environment variables.")
  }

  const baseUrl = getPaypalBaseUrl()
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  })

  if (!response.ok) {
    const errorData = await response.text()
    console.error("PayPal Auth Error Response:", errorData)
    throw new Error(`Failed to authenticate with PayPal: ${response.statusText}`)
  }

  const data = await response.json()
  return data.access_token
}

// Create a PayPal order for the consultation booking
export async function createConsultationPaypalOrder(leadId: string, amount: number, currency: string) {
  try {
    if (!leadId) {
      return { success: false, message: "Lead ID is required" }
    }

    const lead = await prisma.leads.findUnique({
      where: { id: leadId },
    })

    if (!lead) {
      return { success: false, message: "Lead not found" }
    }

    // Supported PayPal currencies: USD, EUR, GBP, AUD, CAD, etc.
    // Ensure AED is handled (PayPal doesn't natively support AED card checkout for international accounts, 
    // we fallback to USD if needed, or process as USD. For this implementation, we assume currency is supported).
    const paypalCurrency = currency === "AED" ? "USD" : currency // Fallback AED to USD if needed, or pass currency
    const finalAmount = currency === "AED" ? Math.round(amount / 3.67) : amount // Convert AED to USD roughly if falling back

    const accessToken = await getPaypalAccessToken()
    const baseUrl = getPaypalBaseUrl()

    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: `lead_${leadId}`,
            amount: {
              currency_code: paypalCurrency,
              value: finalAmount.toString(),
            },
            description: "Specialist Ayurvedic PCOD Consultation - Dr. Arti Singh",
          },
        ],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`PayPal order creation failed: ${errText}`)
    }

    const order = await response.json()
    return {
      success: true,
      orderId: order.id,
    }
  } catch (error) {
    console.error("Failed to create PayPal order:", error)
    return { success: false, message: error instanceof Error ? error.message : "Failed to generate PayPal request." }
  }
}

// Verify/Capture a PayPal order after patient checkout approval
export async function verifyAndCapturePaypalPayment(leadId: string, paypalOrderId: string) {
  try {
    if (!leadId || !paypalOrderId) {
      return { success: false, message: "Missing leadId or paypalOrderId" }
    }

    const accessToken = await getPaypalAccessToken()
    const baseUrl = getPaypalBaseUrl()

    // Capture payment from PayPal
    const response = await fetch(`${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`PayPal capture failed: ${errText}`)
    }

    const captureResult = await response.json()
    const status = captureResult.status

    if (status === "COMPLETED") {
      // Payment Captured Successfully! Update Lead to paid
      await prisma.leads.update({
        where: { id: leadId },
        data: {
          status: "paid",
          notes: `Paid successfully via PayPal. Order ID: ${paypalOrderId}. Transaction captured.`,
        },
      })

      // Try creating a clinic record if patient details match
      const lead = await prisma.leads.findUnique({
        where: { id: leadId },
      })

      if (lead) {
        // Look up or create Patient record
        let patient = await prisma.patients.findFirst({
          where: { phone: lead.phone_number },
        })

        if (!patient) {
          patient = await prisma.patients.create({
            data: {
              name: lead.full_name,
              phone: lead.phone_number,
            },
          })
        }

        // Link patient to the lead
        await prisma.leads.update({
          where: { id: leadId },
          data: { patient_id: patient.id },
        })
      }

      return { success: true, message: "Payment verified and captured successfully!" }
    } else {
      return { success: false, message: `PayPal payment capture status: ${status}` }
    }
  } catch (error) {
    console.error("Failed to verify/capture PayPal payment:", error)
    return { success: false, message: error instanceof Error ? error.message : "Verification error occurred." }
  }
}
