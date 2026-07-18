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
      // Parse paid amount and currency from capture payload
      let paidAmount = 49
      let paidCurrency = "USD"
      try {
        if (captureResult.purchase_units?.[0]?.payments?.captures?.[0]) {
          const capture = captureResult.purchase_units[0].payments.captures[0]
          paidAmount = Number(capture.amount.value)
          paidCurrency = capture.amount.currency_code
        }
      } catch (err) {
        console.error("Failed to parse PayPal details:", err)
      }

      // Fetch existing lead to check recovery sequence
      let lead = await prisma.leads.findUnique({
        where: { id: leadId },
      })

      const isRecovered = lead && lead.recovery_emails_sent && lead.recovery_emails_sent > 0

      // Payment Captured Successfully! Update Lead to paid
      await prisma.leads.update({
        where: { id: leadId },
        data: {
          status: "paid",
          recovery_status: "completed",
          payment_completed_at: new Date(),
          payment_amount: paidAmount,
          payment_currency: paidCurrency,
          recovered_by_email: isRecovered ? true : false,
          notes: `Paid successfully via PayPal. Order ID: ${paypalOrderId}. Transaction captured.`,
        },
      })

      // Send doctor notification email
      if (lead) {
        try {
          const apiKey = process.env.RESEND_API_KEY
          if (apiKey) {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "Ayureva <onboarding@resend.dev>",
                to: ["help@ayureva.in"],
                subject: `💰 Paid Consultation (PayPal): ${lead.full_name}`,
                text: `Hello Dr. Arti,\n\nWe have received a paid consultation booking via PayPal!\n\nPatient Details:\n- Name: ${lead.full_name}\n- Phone: ${lead.phone_number}\n- Message/Concern: ${lead.message}\n- Amount Paid: ${paidCurrency} ${paidAmount}\n- Lead Source: ${lead.source}\n- Recovered via Email: ${isRecovered ? "Yes" : "No"}\n\nSession scheduling is pending. The patient will pick their slot on Calendly.`,
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #bbf7d0; border-radius: 12px; background-color: #f0fdf4;">
                    <h2 style="color: #15803d; margin-top: 0;">💰 Paid Consultation Booking (PayPal)</h2>
                    <p>A new patient has completed checkout payment and is ready for scheduling.</p>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #e5e7eb; width: 140px;">Patient Name:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${lead.full_name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Phone:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><a href="tel:${lead.phone_number}">${lead.phone_number}</a></td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Amount Paid:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #15803d; font-weight: bold;">${paidCurrency} ${paidAmount}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Source:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${lead.source || "Direct"}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Recovered via Email:</td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">${isRecovered ? "Yes" : "No"}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Health Concern:</td>
                        <td style="padding: 8px 0; font-style: italic;">${lead.message || "None provided"}</td>
                      </tr>
                    </table>
                    <p style="font-size: 12px; color: #6b7280;">Please prepare case review before video slot.</p>
                  </div>
                `,
              }),
            })
          }
        } catch (mailError) {
          console.error("Failed to send doctor PayPal notification email:", mailError)
        }
      }

      // Try creating a clinic record if patient details match
      lead = await prisma.leads.findUnique({
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
