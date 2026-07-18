import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Timing Configurations (in hours)
const DELAY_CONFIG = {
  email_2: 24, // Sent 24 hrs after Email 1
  email_3: 24, // Sent 24 hrs after Email 2 (48 hrs total)
  email_4: 48, // Sent 48 hrs after Email 3 (Day 4 total)
  email_5: 72, // Sent 72 hrs after Email 4 (Day 7 total)
}

export async function GET(request: Request) {
  try {
    // Validate authorization header in production
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    if (process.env.NODE_ENV === "production" && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error("RESEND_API_KEY is missing from environment variables")
      return NextResponse.json({ error: "Email configuration missing" }, { status: 500 })
    }

    const now = new Date()

    // 1. Fetch all leads matching recovery criteria:
    // - status = "pending"
    // - recovery_status = "active"
    // - next_recovery_scheduled_at <= now
    const pendingLeads = await prisma.leads.findMany({
      where: {
        status: "pending",
        recovery_status: "active",
        email: { not: null },
        next_recovery_scheduled_at: { lte: now },
      },
    })

    const results = []

    for (const lead of pendingLeads) {
      if (!lead.email) continue

      const nextEmailNumber = (lead.recovery_emails_sent || 0) + 1
      let emailSubject = ""
      let emailHtml = ""
      let emailText = ""
      let nextScheduleHours = 24
      let targetEmailCode = `email_${nextEmailNumber}`

      const checkoutUrl = `https://www.ayureva.in/pay/${lead.id}`
      const patientName = lead.full_name.split(" ")[0]

      if (nextEmailNumber === 2) {
        emailSubject = "Complete Your Consultation Booking | Ayureva"
        nextScheduleHours = DELAY_CONFIG.email_3
        emailText = `Hello ${patientName},\n\nThis is a friendly reminder to complete your booking. Choosing your video consultation slot with Dr. Arti Singh can help you address root causes early.\n\nComplete Payment: ${checkoutUrl}\n\nThank you,\nAyureva Clinic`
        emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937;">
            <div style="text-align: center; margin-bottom: 24px;">
              <img src="https://www.ayureva.in/icon.png" alt="Ayureva Logo" style="height: 48px;" />
              <h2 style="color: #047857; margin-top: 12px; font-size: 22px;">Complete Your Consultation Booking</h2>
            </div>
            
            <p>Dear <strong>${patientName}</strong>,</p>
            
            <p>This is a friendly reminder that your request for a video consultation with <strong>Dr. Arti Singh</strong> is still pending checkout.</p>
            
            <p style="background-color: #f9fafb; border-left: 4px solid #047857; padding: 12px; font-size: 14px; color: #4b5563; font-style: italic;">
              "Addressing hormonal and gut imbalances early prevents chronic tissues and adhesions from accumulating."
            </p>
            
            <p style="font-size: 14px;">Complete your checkout payment below to pick your date and time slot:</p>
            
            <div style="text-align: center; margin: 28px 0;">
              <a href="${checkoutUrl}" style="background-color: #047857; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">Proceed to Secure Payment</a>
            </div>
            
            <p style="font-size: 12px; color: #6b7280; text-align: center;">Need assistance? Just reply directly to this email.</p>
          </div>
        `
      } else if (nextEmailNumber === 3) {
        emailSubject = "Frequently Asked Questions About Your Consultation"
        nextScheduleHours = DELAY_CONFIG.email_4
        emailText = `Hello ${patientName},\n\nWe answered some common questions regarding your consultation:\n- Video Call: 45-60 mins\n- Prescription: Digital PDF\n- Follow-up: 14 days WhatsApp support\n\nComplete Payment: ${checkoutUrl}`
        emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937;">
            <div style="text-align: center; margin-bottom: 24px;">
              <img src="https://www.ayureva.in/icon.png" alt="Ayureva Logo" style="height: 48px;" />
              <h2 style="color: #047857; margin-top: 12px; font-size: 22px;">How Your Consultation Works</h2>
            </div>
            
            <p>Dear <strong>${patientName}</strong>,</p>
            
            <p>We want to ensure you feel comfortable. Here are the answers to frequently asked questions:</p>
            
            <div style="margin: 20px 0; font-size: 14px; space-y-4;">
              <div style="margin-bottom: 16px;">
                <strong style="color: #047857;">Q. How long is the video consultation?</strong>
                <p style="margin: 4px 0 0 0; color: #4b5563;">It lasts 45 to 60 minutes, giving Dr. Arti plenty of time to analyze your specific concerns.</p>
              </div>
              <div style="margin-bottom: 16px;">
                <strong style="color: #047857;">Q. Will I receive a prescription?</strong>
                <p style="margin: 4px 0 0 0; color: #4b5563;">Yes. You will receive an official digital prescription containing details on classical herbal formulations, dosage, and dietary guidelines.</p>
              </div>
              <div style="margin-bottom: 16px;">
                <strong style="color: #047857;">Q. How do I join the video session?</strong>
                <p style="margin: 4px 0 0 0; color: #4b5563;">After checkout, you pick a slot on Calendly. A Google Meet invite link is automatically sent to your inbox.</p>
              </div>
            </div>
            
            <div style="text-align: center; margin: 28px 0;">
              <a href="${checkoutUrl}" style="background-color: #047857; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Proceed to Secure Checkout</a>
            </div>
          </div>
        `
      } else if (nextEmailNumber === 4) {
        emailSubject = "Your Consultation Request Is Still Pending | Ayureva"
        nextScheduleHours = DELAY_CONFIG.email_5
        emailText = `Hello ${patientName},\n\nWe understand that busy schedules can get in the way. Reclaim your health by booking your session with Dr. Arti.\n\nComplete Payment: ${checkoutUrl}`
        emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937;">
            <div style="text-align: center; margin-bottom: 24px;">
              <img src="https://www.ayureva.in/icon.png" alt="Ayureva Logo" style="height: 48px;" />
              <h2 style="color: #047857; margin-top: 12px; font-size: 22px;">Reclaim Your Well-being</h2>
            </div>
            
            <p>Dear <strong>${patientName}</strong>,</p>
            
            <p>We wanted to reach out because your wellness request is still pending checkout. Dr. Arti Singh specializes in helping women target root-causes of hormonal, weight, and thyroid imbalances naturally.</p>
            
            <p style="font-size: 14px;">Our treatment programs focus on correcting your Agni (digestive fire) and regulating nervous system triggers so you can restore deep cellular health.</p>
            
            <div style="text-align: center; margin: 28px 0;">
              <a href="${checkoutUrl}" style="background-color: #047857; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Secure Consultation Booking</a>
            </div>
          </div>
        `
      } else if (nextEmailNumber === 5) {
        emailSubject = "Final Reminder – Complete Your Consultation Request"
        nextScheduleHours = 0 // final step
        emailText = `Hello ${patientName},\n\nThis is our final reminder. Please complete payment if you would like to secure your slot: ${checkoutUrl}`
        emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937;">
            <div style="text-align: center; margin-bottom: 24px;">
              <img src="https://www.ayureva.in/icon.png" alt="Ayureva Logo" style="height: 48px;" />
              <h2 style="color: #b91c1c; margin-top: 12px; font-size: 22px;">Final Reminder</h2>
            </div>
            
            <p>Dear <strong>${patientName}</strong>,</p>
            
            <p>This is our final follow-up regarding your consultation request. We will close this request automatically in 24 hours if checkout is not completed.</p>
            
            <p style="font-size: 14px;">If you have any questions or would like to speak to our care team directly before paying, please reply directly to this email and we will help you.</p>
            
            <div style="text-align: center; margin: 28px 0;">
              <a href="${checkoutUrl}" style="background-color: #b91c1c; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Secure Your Consultation Slot</a>
            </div>
          </div>
        `
      }

      if (emailSubject && emailHtml) {
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Dr. Arti - Ayureva <dr.arti@ayureva.in>",
              to: [lead.email],
              reply_to: "dr.arti@ayureva.in",
              subject: emailSubject,
              text: emailText,
              html: emailHtml,
            }),
          })

          if (res.ok) {
            // Update database markers
            const isFinal = nextEmailNumber === 5
            await prisma.leads.update({
              where: { id: lead.id },
              data: {
                recovery_emails_sent: nextEmailNumber,
                last_recovery_email_sent: targetEmailCode,
                last_recovery_email_sent_at: now,
                recovery_status: isFinal ? "completed" : "active",
                next_recovery_scheduled_at: isFinal
                  ? null
                  : new Date(now.getTime() + nextScheduleHours * 60 * 60 * 1000),
              },
            })

            results.push({ leadId: lead.id, status: "success", step: targetEmailCode })
          } else {
            const errText = await res.text()
            console.error(`Failed to send email to ${lead.email}:`, res.status, errText)
            results.push({ leadId: lead.id, status: "failed", error: errText })
          }
        } catch (err) {
          console.error(`Cron error processing lead ${lead.id}:`, err)
          results.push({ leadId: lead.id, status: "error", error: String(err) })
        }
      }
    }

    return NextResponse.json({ success: true, processed: pendingLeads.length, results })
  } catch (error) {
    console.error("Cron worker runtime error:", error)
    return NextResponse.json({ error: "Cron worker failed" }, { status: 500 })
  }
}
