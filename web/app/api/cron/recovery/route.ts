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
        emailSubject = "Just checking in"
        nextScheduleHours = DELAY_CONFIG.email_3
        emailText = `Hello ${patientName},\n\nI'm just checking in to see if you had any questions about scheduling your video consultation.\n\nI understand that consulting a doctor online can sometimes feel unfamiliar. We will be using a secure video call to discuss your symptoms in detail, so you can share your health history comfortably.\n\nIf you would still like to move forward, you can complete your booking and pick a time slot using the link below:\n${checkoutUrl}\n\nIf now isn't the right time, or if you have any questions about the consultation, please feel free to reply directly to this email.\n\nWarm regards,\nDr. Arti Singh`
        emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937; line-height: 1.5; font-size: 14px;">
            <p>Hello ${patientName},</p>
            
            <p>I'm just checking in to see if you had any questions about scheduling your video consultation.</p>
            
            <p>I understand that consulting a doctor online can sometimes feel unfamiliar. We will be using a secure video call to discuss your symptoms in detail, so you can share your health history comfortably.</p>
            
            <p>If you would still like to move forward, you can complete your booking and pick a time slot here:</p>
            
            <div style="text-align: center; margin: 24px 0;">
              <a href="${checkoutUrl}" style="background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">Complete Your Booking</a>
            </div>
            
            <p>If now isn't the right time, or if you have any questions about the consultation setup, please feel free to reply directly to this email.</p>
            
            <p style="margin-top: 24px;">Warm regards,</p>
            <p style="font-weight: bold; color: #047857; margin: 0;">Dr. Arti Singh (B.A.M.S.)</p>
          </div>
        `
      } else if (nextEmailNumber === 3) {
        emailSubject = "What happens during the consultation?"
        nextScheduleHours = DELAY_CONFIG.email_4
        emailText = `Hello ${patientName},\n\nMany patients ask me what they need to prepare before their first online consultation. Here are a few details that might help:\n\n- Do I need reports? If you have recent blood tests or ultrasound scans (especially for PCOS or thyroid), please have them ready. If not, don't worry—we can still start.\n- How long does it take? We will spend 45 to 60 minutes discussing your current concerns, diet, and sleep patterns.\n- What happens next? After the call, I will email you a personalized treatment plan and lifestyle recommendations within 24 hours.\n\nIf you would like to proceed with your booking, you can choose a convenient slot here:\n${checkoutUrl}\n\nIf you have any questions, you can reply directly to this email.\n\nWarm regards,\nDr. Arti Singh`
        emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937; line-height: 1.5; font-size: 14px;">
            <p>Hello ${patientName},</p>
            
            <p>Many patients ask me what they need to prepare before their first online consultation. Here are a few details that might help you get ready:</p>
            
            <ul style="padding-left: 20px; margin: 16px 0; space-y-3;">
              <li style="margin-bottom: 8px;"><strong>Do I need reports?</strong> If you have recent blood tests or ultrasound scans (especially for PCOS or thyroid), please have them ready. If not, don't worry—we can still start.</li>
              <li style="margin-bottom: 8px;"><strong>How long does it take?</strong> We will spend 45 to 60 minutes discussing your current concerns, diet, and sleep patterns.</li>
              <li style="margin-bottom: 8px;"><strong>What happens next?</strong> After the call, I will email you a personalized treatment plan and lifestyle recommendations within 24 hours.</li>
            </ul>
            
            <p>If you would like to proceed with your booking, you can complete it and choose a convenient slot here:</p>
            
            <div style="text-align: center; margin: 24px 0;">
              <a href="${checkoutUrl}" style="background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">Choose a Consultation Slot</a>
            </div>
            
            <p>If you have any questions, you can reply directly to this email.</p>
            
            <p style="margin-top: 24px;">Warm regards,</p>
            <p style="font-weight: bold; color: #047857; margin: 0;">Dr. Arti Singh (B.A.M.S.)</p>
          </div>
        `
      } else if (nextEmailNumber === 4) {
        emailSubject = "A note about your symptoms"
        nextScheduleHours = DELAY_CONFIG.email_5
        emailText = `Hello ${patientName},\n\nI wanted to share a brief note about how I approach treatment.\n\nIn my years of clinical practice helping women manage PCOS, thyroid, and pelvic health concerns, I have found that chronic conditions respond best when we look at the whole body, rather than just masking individual symptoms.\n\nMy focus is on restoring your natural balance through customized herbal protocols and simple, practical changes to your daily diet and lifestyle.\n\nIf you would like to discuss your symptoms and start a guided treatment plan, you can complete your booking using the link below:\n${checkoutUrl}\n\nI look forward to helping you.\n\nWarm regards,\nDr. Arti Singh`
        emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937; line-height: 1.5; font-size: 14px;">
            <p>Hello ${patientName},</p>
            
            <p>I wanted to share a brief note about how I approach treatment.</p>
            
            <p>In my years of clinical practice helping women manage PCOS, thyroid, and pelvic health concerns, I have found that chronic conditions respond best when we look at the whole body, rather than just masking individual symptoms.</p>
            
            <p>My focus is on helping you find lasting relief through customized Ayurvedic herbal protocols and simple, practical changes to your daily diet and lifestyle.</p>
            
            <p>If you would like to discuss your symptoms and start a guided treatment plan, you can complete your booking using the link below:</p>
            
            <div style="text-align: center; margin: 24px 0;">
              <a href="${checkoutUrl}" style="background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">Schedule Your Consultation</a>
            </div>
            
            <p>I look forward to helping you.</p>
            
            <p style="margin-top: 24px;">Warm regards,</p>
            <p style="font-weight: bold; color: #047857; margin: 0;">Dr. Arti Singh (B.A.M.S.)</p>
          </div>
        `
      } else if (nextEmailNumber === 5) {
        emailSubject = "I'll close your consultation request for now"
        nextScheduleHours = 0 // final step
        emailText = `Hello ${patientName},\n\nI didn't want your consultation request to go unanswered, but I understand that life gets busy and now might not be the right time for you.\n\nI will close this pending request for now to keep my scheduling calendar organized for active patients.\n\nIf you would still like to consult with me in the future, you can complete your booking anytime using this link:\n${checkoutUrl}\n\nOtherwise, whenever you are ready, you can simply reply directly to this email to get in touch.\n\nWishing you good health,\nDr. Arti Singh`
        emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937; line-height: 1.5; font-size: 14px;">
            <p>Hello ${patientName},</p>
            
            <p>I didn't want your consultation request to go unanswered, but I understand that life gets busy and now might not be the right time for you.</p>
            
            <p>I will close this pending request for now to keep my scheduling calendar organized for active patients.</p>
            
            <p>If you would still like to consult with me in the future, you can complete your booking anytime using this link:</p>
            
            <div style="text-align: center; margin: 24px 0;">
              <a href="${checkoutUrl}" style="background-color: #7c2d12; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">Complete Booking Anytime</a>
            </div>
            
            <p>Otherwise, whenever you are ready, you can simply reply directly to this email to get in touch.</p>
            
            <p style="margin-top: 24px;">Wishing you good health,</p>
            <p style="font-weight: bold; color: #7c2d12; margin: 0;">Dr. Arti Singh (B.A.M.S.)</p>
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
