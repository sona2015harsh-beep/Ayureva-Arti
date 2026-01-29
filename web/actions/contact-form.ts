"use server"

import { z } from "zod"

const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  healthConcern: z.string().min(2, "Please describe your health concern in detail"),
})

// Simple HTML escape function to prevent XSS in emails without heavy dependencies
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export async function submitContactForm(formData: FormData) {
  try {
    // Check if RESEND_API_KEY exists
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set in environment variables")
      return {
        success: false,
        message: "Email service configuration error. Please contact us directly at +91 9709968077",
      }
    }

    // Sanitize inputs before any processing
    const sanitize = (val: FormDataEntryValue | null) => {
      if (typeof val !== "string") return ""
      return escapeHtml(val.trim())
    }

    const rawData = {
      firstName: sanitize(formData.get("firstName")),
      lastName: sanitize(formData.get("lastName")),
      email: sanitize(formData.get("email")),
      phone: sanitize(formData.get("phone")),
      healthConcern: sanitize(formData.get("healthConcern")),
    }

    // Validate form data
    const validatedFields = contactFormSchema.safeParse(rawData)

    if (!validatedFields.success) {
      console.error("Form validation failed:", validatedFields.error.flatten().fieldErrors)
      return {
        success: false,
        message: "Please fill all fields correctly",
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { firstName, lastName, email, phone, healthConcern } = validatedFields.data

    // Simplified email content to avoid parsing issues
    const emailContent = `New Consultation Request - Ayureva

Patient Details:
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Health Concern: ${healthConcern}

Submitted: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}

Please contact the patient to schedule their consultation.`

    // Send email using Resend API with the new API key
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Ayureva <onboarding@resend.dev>",
        to: ["drartisingh1102@gmail.com"],
        subject: `New Consultation Request from ${firstName} ${lastName}`,
        text: emailContent,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #16a34a;">New Consultation Request</h1>
            <p style="color: #16a34a;">Ayureva by Dr. Arti Singh</p>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #15803d;">Patient Details:</h2>
              <p><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
              <p><strong>Health Concern:</strong></p>
              <div style="background-color: white; padding: 15px; border-radius: 6px;">
                ${healthConcern}
              </div>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="tel:${phone}" style="background-color: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin: 0 10px;">Call Patient</a>
              <a href="mailto:${email}" style="background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin: 0 10px;">Email Patient</a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              Submitted on: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
            </p>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Resend API Error:", response.status, errorText)

      // Try to parse the error for more specific messaging
      let errorMessage = "Failed to send email. Please try again."
      try {
        const errorData = JSON.parse(errorText)

        if (errorData.message) {
          if (errorData.message.includes("API key")) {
            errorMessage = "Email service authentication error. Please contact us directly."
          } else if (errorData.message.includes("domain")) {
            errorMessage = "Email domain verification pending. Please contact us directly."
          } else {
            errorMessage = `Email service error: ${errorData.message}`
          }
        }
      } catch (parseError) {
        console.error("Could not parse error response")
      }

      return {
        success: false,
        message: `${errorMessage} Please call us at +91 9709968077 or email drartisingh1102@gmail.com`,
      }
    }

    const result = await response.json()

    return {
      success: true,
      message: "Thank you for your inquiry! Dr. Arti Singh will contact you within 24 hours to schedule your consultation.",
    }
  } catch (error) {
    console.error("Contact form submission error:", error)

    return {
      success: false,
      message: "Sorry, there was an unexpected error. Please call us directly at +91 9709968077 or email drartisingh1102@gmail.com",
    }
  }
}
