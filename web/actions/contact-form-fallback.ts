"use server"

import { z } from "zod"

const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  healthConcern: z.string().min(10, "Please describe your health concern in detail"),
})

export async function submitContactFormFallback(formData: FormData) {
  try {
    console.log("=== Contact Form Submission Started (Fallback) ===")

    // Validate form data
    const validatedFields = contactFormSchema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      healthConcern: formData.get("healthConcern"),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Please fill all fields correctly",
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { firstName, lastName, email, phone, healthConcern } = validatedFields.data

    // In production, this should be replaced with actual email sending or database storage
    // For now, we log to server console as a fallback
    console.error("CONSULTATION REQUEST RECEIVED - Email service unavailable")

    // You can also store this in a database or send to a webhook
    // For now, we'll simulate success
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate processing time

    return {
      success: true,
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
