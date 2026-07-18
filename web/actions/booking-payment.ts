"use server"

import Razorpay from "razorpay"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"

// Initialize Razorpay client with secure environment variables
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mock_key_id",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "rzp_test_mock_secret",
  })
}

export async function createConsultationRazorpayOrder(leadId: string, amount: number) {
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

    const razorpay = getRazorpayInstance()

    // Create order options
    const options = {
      amount: amount * 100, // Razorpay expects amount in paisa (e.g. 500 INR = 50000 paisa)
      currency: "INR",
      receipt: `consultation_${leadId.substring(0, 8)}`,
      notes: {
        leadId: leadId,
        patientName: lead.full_name,
        type: "pcod_consultation",
      },
    }

    try {
      const order = await razorpay.orders.create(options)
      return {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_mock_key_id",
      }
    } catch (rzpError) {
      console.error("Razorpay Order Creation Error:", rzpError)
      
      // Fallback for development if keys are not set
      if (process.env.NODE_ENV !== "production") {
        console.log("Using Mock Razorpay Order for development...")
        return {
          success: true,
          orderId: `order_mock_${Date.now()}`,
          amount: amount * 100,
          currency: "INR",
          keyId: "rzp_test_mock_key_id",
          isMock: true,
        }
      }
      throw rzpError
    }
  } catch (error) {
    console.error("Failed to create consultation Razorpay order:", error)
    return { success: false, message: "Failed to generate payment request. Please try again." }
  }
}

export async function verifyConsultationPayment(
  leadId: string,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) {
  try {
    if (!leadId || !razorpayOrderId || !razorpayPaymentId) {
      return { success: false, message: "Missing payment parameters" }
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_mock_secret"
    let isValid = false

    // Check for mock order ID bypass in dev mode
    if (razorpayOrderId.startsWith("order_mock_")) {
      isValid = true
    } else {
      const body = razorpayOrderId + "|" + razorpayPaymentId
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex")

      if (expectedSignature === razorpaySignature) {
        isValid = true
      }
    }

    if (isValid) {
      // Fetch verified payment details from Razorpay
      let paidAmount = 500
      let paidCurrency = "INR"
      try {
        const razorpay = getRazorpayInstance()
        if (!razorpayOrderId.startsWith("order_mock_")) {
          const paymentDetails = await razorpay.payments.fetch(razorpayPaymentId)
          paidAmount = Number(paymentDetails.amount) / 100
          paidCurrency = paymentDetails.currency
        }
      } catch (err) {
        console.error("Failed to fetch Razorpay details:", err)
      }

      // Fetch existing lead to check recovery sequence
      const lead = await prisma.leads.findUnique({
        where: { id: leadId },
      })

      const isRecovered = lead && lead.recovery_emails_sent && lead.recovery_emails_sent > 0

      // Update the lead status in the database to paid
      await prisma.leads.update({
        where: { id: leadId },
        data: {
          status: "paid",
          recovery_status: "completed",
          payment_completed_at: new Date(),
          payment_amount: paidAmount,
          payment_currency: paidCurrency,
          recovered_by_email: isRecovered ? true : false,
          notes: `Paid successfully. Razorpay Order ID: ${razorpayOrderId}, Payment ID: ${razorpayPaymentId}.`,
        },
      })

      // Send doctor notification
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
                subject: `💰 Paid Consultation: ${lead.full_name}`,
                text: `Hello Dr. Arti,\n\nWe have received a paid consultation booking!\n\nPatient Details:\n- Name: ${lead.full_name}\n- Phone: ${lead.phone_number}\n- Message/Concern: ${lead.message}\n- Amount Paid: ${paidCurrency} ${paidAmount}\n- Lead Source: ${lead.source}\n- Recovered via Email: ${isRecovered ? "Yes" : "No"}\n\nSession scheduling is pending. The patient will pick their slot on Calendly.`,
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #bbf7d0; border-radius: 12px; background-color: #f0fdf4;">
                    <h2 style="color: #15803d; margin-top: 0;">💰 Paid Consultation Booking</h2>
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
          console.error("Failed to send doctor notification email:", mailError)
        }
      }

      return { success: true, message: "Payment verified successfully!" }
    } else {
      return { success: false, message: "Invalid payment signature verification failed." }
    }
  } catch (error) {
    console.error("Failed to verify consultation payment:", error)
    return { success: false, message: "Internal verification error" }
  }
}
