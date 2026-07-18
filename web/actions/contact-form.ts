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
      countryCode: sanitize(formData.get("countryCode")),
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

    const { firstName, lastName, email, countryCode, phone, healthConcern } = validatedFields.data
    const fullPhoneNumber = `${countryCode} ${phone}`

    const utmSource = sanitize(formData.get("utm_source")) || null
    const utmMedium = sanitize(formData.get("utm_medium")) || null
    const utmCampaign = sanitize(formData.get("utm_campaign")) || null

    // Save lead to database
    const newLead = await prisma.leads.create({
      data: {
        full_name: `${firstName} ${lastName}`,
        email: email,
        phone_number: fullPhoneNumber,
        message: healthConcern,
        status: "pending",
        recovery_status: "active",
        recovery_emails_sent: 1,
        last_recovery_email_sent: "email_1",
        first_recovery_email_sent_at: new Date(),
        last_recovery_email_sent_at: new Date(),
        next_recovery_scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next email in 24 hours
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      },
    })

    // Simplified email content to avoid parsing issues
    const emailContent = `New Consultation Request - Ayureva

Patient Details:
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Health Concern: ${healthConcern}

Submitted: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}

Please contact the patient to schedule their consultation.`

    // Send email using Resend API to the doctor
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Ayureva <onboarding@resend.dev>",
        to: ["help@ayureva.in"],
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

    // Send Email 1 to patient immediately (Recovery Email 1)
    const checkoutUrl = `https://www.ayureva.in/pay/${newLead.id}`
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Dr. Arti - Ayureva <dr.arti@ayureva.in>",
          to: [email],
          reply_to: "dr.arti@ayureva.in",
          subject: "Thank you for your consultation request",
          text: `Hello ${firstName},\n\nThank you for taking the time to share your health concern with me. I know reaching out for help is often the hardest first step, and I'm glad you did.\n\nThe next step is to schedule a 45–60 minute video call so we can discuss your symptoms in detail and decide the most appropriate treatment approach for your condition. If appropriate after the consultation, I will prepare a personalized Ayurvedic treatment plan and digital prescription.\n\nIf you would still like to consult with me, you can complete your booking and pick a time slot using the link below:\n${checkoutUrl}\n\nIf you have any questions before booking, simply reply to this email. My team and I will be happy to help.\n\nWarm regards,\n\nDr. Arti Singh (B.A.M.S.)\nAyureva Clinic\n\nIf this email reached you by mistake or you've already completed your booking, you can simply ignore this message.`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937; line-height: 1.5; font-size: 14px;">
              <p>Hello ${firstName},</p>
              
              <p>Thank you for taking the time to share your health concern with me. I know reaching out for help is often the hardest first step, and I'm glad you did.</p>
              
              <p>The next step is to schedule a 45–60 minute video call so we can discuss your symptoms in detail and decide the most appropriate treatment approach for your condition. If appropriate after the consultation, I will prepare a personalized Ayurvedic treatment plan and digital prescription.</p>
              
              <p>If you would still like to consult with me, you can complete your booking and pick a time slot using the link below:</p>
              
              <div style="text-align: center; margin: 24px 0;">
                <a href="${checkoutUrl}" style="background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">Complete Your Booking</a>
              </div>
              
              <p>If you have any questions before booking, simply reply to this email. My team and I will be happy to help.</p>
              
              <p style="margin-top: 24px; margin-bottom: 0;">Warm regards,</p>
              <p style="font-weight: bold; color: #047857; margin: 4px 0 0 0;">Dr. Arti Singh (B.A.M.S.)</p>
              <p style="font-size: 12px; color: #6b7280; margin: 2px 0 0 0;">Ayureva Clinic</p>
              
              <p style="font-size: 11px; color: #9ca3af; margin-top: 28px; border-top: 1px solid #f3f4f6; padding-top: 12px; font-style: italic;">
                If this email reached you by mistake or you've already completed your booking, you can simply ignore this message.
              </p>
            </div>
          `,
        }),
      })
    } catch (eError) {
      console.error("Failed to send patient confirmation email:", eError)
    }

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
        message: `${errorMessage} Please call us at +91 9709968077 or email help@ayureva.in`,
      }
    }

    const result = await response.json()

    return {
      success: true,
      leadId: newLead.id,
      message: "Thank you for your inquiry! Dr. Arti Singh will contact you within 24 hours to schedule your consultation.",
    }
  } catch (error) {
    console.error("Contact form submission error:", error)

    return {
      success: false,
      message: "Sorry, there was an unexpected error. Please call us directly at +91 9709968077 or email help@ayureva.in",
    }
  }
}
