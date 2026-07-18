"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"

const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  countryCode: z.string().min(1, "Country code is required").max(6, "Invalid country code"),
  phone: z.string().min(5, "Please enter a valid phone number"),
  healthConcern: z.string().min(2, "Please describe your health concern in detail"),
})

export async function submitContactFormFallback(formData: FormData) {
  try {
    console.log("=== Contact Form Submission Started (Fallback) ===")

    const sanitize = (val: FormDataEntryValue | null) => {
      if (typeof val !== "string") return ""
      return val.trim()
    }

    const rawData = {
      firstName: sanitize(formData.get("firstName")),
      lastName: sanitize(formData.get("lastName")),
      email: sanitize(formData.get("email")),
      countryCode: sanitize(formData.get("countryCode")),
      phone: sanitize(formData.get("phone")),
      healthConcern: sanitize(formData.get("healthConcern")),
    }

    // Validate form data
    const validatedFields = contactFormSchema.safeParse(rawData)

    if (!validatedFields.success) {
      console.error("Fallback Form Validation Failed:", validatedFields.error.flatten().fieldErrors)
      return {
        success: false,
        message: "Please fill all fields correctly",
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { firstName, lastName, email, countryCode, phone, healthConcern } = validatedFields.data
    const fullPhoneNumber = `${countryCode} ${phone}`

    // Save lead to database (Fallback insurance)
    const newLead = await prisma.leads.create({
      data: {
        full_name: `${firstName} ${lastName}`,
        email: email,
        phone_number: fullPhoneNumber,
        message: healthConcern,
        status: "pending",
        recovery_status: "active",
        recovery_emails_sent: 0, // 0 since email confirmation failed to send
        next_recovery_scheduled_at: new Date(Date.now() + 2 * 60 * 60 * 1000), // Check in 2 hours since fallback was triggered
      },
    })

    console.error("CONSULTATION REQUEST RECEIVED - Saved to database, but email service failed")

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      leadId: newLead.id,
      message:
        "Thank you for your inquiry! We received your request. Dr. Arti Singh will contact you within 24 hours. For immediate assistance, please call +91 9709968077.",
    }
  } catch (error) {
    console.error("Contact form fallback error:", error)
    return {
      success: false,
      message:
        "Sorry, there was an error processing your request. Please call us directly at +91 9709968077 or email drartisingh1102@gmail.com",
    }
  }
}
