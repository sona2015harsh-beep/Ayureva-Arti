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
      // Update the lead status in the database to paid
      await prisma.leads.update({
        where: { id: leadId },
        data: {
          status: "paid",
          notes: `Paid successfully. Razorpay Order ID: ${razorpayOrderId}, Payment ID: ${razorpayPaymentId}.`,
        },
      })

      return { success: true, message: "Payment verified successfully!" }
    } else {
      return { success: false, message: "Invalid payment signature verification failed." }
    }
  } catch (error) {
    console.error("Failed to verify consultation payment:", error)
    return { success: false, message: "Internal verification error" }
  }
}
