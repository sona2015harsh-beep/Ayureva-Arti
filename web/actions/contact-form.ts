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
          from: "Ayureva <onboarding@resend.dev>",
          to: [email],
          reply_to: "drartisingh1102@gmail.com",
          subject: "Your Consultation Request Has Been Received",
          text: `Hello ${firstName},\n\nWe have received your consultation request. Please complete your secure payment to book your session: ${checkoutUrl}\n\nWhat is included:\n- 45-60 min private video consultation\n- Customized treatment plan\n- Digital prescription\n\nConsultation Fee: ₹999 INR (Domestic) / $49 USD (International)\n\nThank you,\nDr. Arti Singh\nAyureva Clinic`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937;">
              <div style="text-align: center; margin-bottom: 24px;">
                <img src="https://www.ayureva.in/icon.png" alt="Ayureva Logo" style="height: 48px;" />
                <h2 style="color: #047857; margin-top: 12px; font-size: 22px;">Your Consultation Request Received</h2>
              </div>
              
              <p>Dear <strong>${firstName} ${lastName}</strong>,</p>
              
              <p>Thank you for requesting an online video consultation with <strong>Dr. Arti Singh (B.A.M.S.)</strong>. We have saved your symptoms profile and health concern details.</p>
              
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <h3 style="color: #15803d; margin-top: 0; font-size: 16px;">What Your Consultation Includes:</h3>
                <ul style="padding-left: 20px; margin: 0; font-size: 14px; line-height: 1.6;">
                  <li><strong>45–60 Minute Secure Video Call</strong> with Dr. Arti Singh</li>
                  <li><strong>Complete Case History</strong> and personalized Dosha diagnostics</li>
                  <li><strong>Customized Herbal Medicine Formulation</strong></li>
                  <li><strong>Personalized Diet & Lifestyle Plan</strong></li>
                  <li><strong>14-day direct WhatsApp follow-up support</strong></li>
                </ul>
              </div>
              
              <p style="font-size: 14px; color: #4b5563;">To secure your slot and schedule your session, please complete the checkout payment below:</p>
              
              <div style="text-align: center; margin: 28px 0;">
                <a href="${checkoutUrl}" style="background-color: #047857; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-decoration: none !important;">Complete Your Checkout Payment</a>
              </div>
              
              <div style="font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 28px;">
                <p><strong>Dr. Arti Singh</strong> is a registered Ayurvedic Physician (Reg No. 4200 Bihar) specializing in PCOS/PCOD reversal, thyroid disorders, and women's pelvic health.</p>
                <p style="margin-top: 8px; font-style: italic;">If you have any questions, feel free to reply directly to this email.</p>
              </div>
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
        message: `${errorMessage} Please call us at +91 9709968077 or email drartisingh1102@gmail.com`,
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
      message: "Sorry, there was an unexpected error. Please call us directly at +91 9709968077 or email drartisingh1102@gmail.com",
    }
  }
}
