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
        emailSubject = "Quick follow-up on your health consultation — Dr. Arti Singh"
        nextScheduleHours = DELAY_CONFIG.email_3
        emailText = `Hello ${patientName},\n\nI wanted to check back on your consultation request. In Ayurveda, we say that addressing imbalances early prevents toxins (Ama) from settling deeper into your tissues.\n\nIf you'd still like to get to the root of your health concern, you can secure your video slot here: ${checkoutUrl}\n\nIf you have any questions or are facing payment issues, please reply directly to this email—I read and reply to all my patient emails myself.\n\nWarmly,\nDr. Arti Singh\nAyureva Clinic`
        emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937;">
            <p>Hello <strong>${patientName}</strong>,</p>
            
            <p>I wanted to follow up with you personally regarding your consultation request. In Ayurveda, we emphasize that addressing metabolic and hormonal imbalances early prevents toxins (Ama) from settling deeper into your tissues and causing chronic symptoms.</p>
            
            <p style="background-color: #f9fafb; border-left: 4px solid #047857; padding: 12px; font-size: 13px; color: #4b5563; font-style: italic;">
              "Early correction of Apana Vata flow prevents cellular blockages from setting in."
            </p>
            
            <p>If you would still like to work together to address your health concerns, you can secure your consultation slot and complete checkout here:</p>
            
            <div style="text-align: center; margin: 24px 0;">
              <a href="${checkoutUrl}" style="background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">Secure My Consultation Slot</a>
            </div>
            
            <p>If you have any questions or are experiencing payment issues, please feel free to reply directly to this email. I read and respond to my patient emails myself.</p>
            
            <p style="font-size: 13px; margin-top: 24px;">Warmly,</p>
            <p style="font-size: 14px; font-weight: bold; color: #047857; margin: 0;">Dr. Arti Singh (B.A.M.S.)</p>
          </div>
        `
      } else if (nextEmailNumber === 3) {
        emailSubject = "How my online Ayurvedic consultations work"
        nextScheduleHours = DELAY_CONFIG.email_4
        emailText = `Hello ${patientName},\n\nPatients often ask me how a virtual Ayurvedic consultation works. Here are the details:\n1. Detailed Consultation: 45-60 minutes video call\n2. Personalized Protocol: Custom herbal formulations and region-specific diet plan\n3. Continuous Support: 14-day WhatsApp follow-up support\n\nYou can book your session and secure your slot here: ${checkoutUrl}\n\nWarmly,\nDr. Arti Singh`
        emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937;">
            <p>Hello <strong>${patientName}</strong>,</p>
            
            <p>Patients often ask me how an online Ayurvedic consultation works and what they can expect. I wanted to share a few details to make you feel comfortable:</p>
            
            <div style="margin: 20px 0; font-size: 13px; line-height: 1.6;">
              <div style="margin-bottom: 16px;">
                <strong style="color: #047857; font-size: 14px;">1. Detailed Video Consultation (45-60 Mins)</strong>
                <p style="margin: 4px 0 0 0; color: #4b5563;">We spend time discussing your specific concerns, dietary habits, stress levels, and digestion. This helps me identify the root-cause imbalances.</p>
              </div>
              <div style="margin-bottom: 16px;">
                <strong style="color: #047857; font-size: 14px;">2. Personalized Ayurvedic Protocol</strong>
                <p style="margin: 4px 0 0 0; color: #4b5563;">You will receive an official digital prescription with classical herbal formulations (such as Kanchanar Guggulu or Chandraprabha Vati, if appropriate) and a tailored diet plan.</p>
              </div>
              <div style="margin-bottom: 16px;">
                <strong style="color: #047857; font-size: 14px;">3. Direct Support</strong>
                <p style="margin: 4px 0 0 0; color: #4b5563;">To ensure you implement the plan successfully, you will have 14 days of direct WhatsApp follow-up support with my care team.</p>
              </div>
            </div>
            
            <div style="text-align: center; margin: 24px 0;">
              <a href="${checkoutUrl}" style="background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block;">Proceed to Secure Checkout</a>
            </div>
            
            <p>I look forward to helping you start your healing journey.</p>
            
            <p style="font-size: 13px; margin-top: 24px;">Warmly,</p>
            <p style="font-size: 14px; font-weight: bold; color: #047857; margin: 0;">Dr. Arti Singh (B.A.M.S.)</p>
          </div>
        `
      } else if (nextEmailNumber === 4) {
        emailSubject = "A quick note on root-cause healing — Dr. Arti Singh"
        nextScheduleHours = DELAY_CONFIG.email_5
        emailText = `Hello ${patientName},\n\nMany of my patients struggle with chronic issues (like PCOS, thyroid, or gut disorders) for years, relying on temporary fixes. In my practice, I focus on correcting cell-level digestion (Dhatu Agni) to restore natural hormonal balance.\n\nIf you are ready to start your root-cause healing journey, you can secure your video slot here: ${checkoutUrl}\n\nWarmly,\nDr. Arti`
        emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937;">
            <p>Hello <strong>${patientName}</strong>,</p>
            
            <p>Many patients come to me after struggling with symptoms like irregular cycles, sudden weight gain, or thyroid sluggishness for years. Often, they have only been managing the symptoms, rather than looking at why they began.</p>
            
            <p>In my clinical practice, I focus on identifying the root blockages in your channels (*Srotas*) and correcting your cellular metabolic fire (*Dhatu Agni*). When your body digests nutrients and hormones correctly, healing happens naturally and sustainably.</p>
            
            <p>Most patients experience a significant shift in their bloating, energy levels, and cycles within 3 to 4 weeks of starting their custom protocol.</p>
            
            <div style="text-align: center; margin: 24px 0;">
              <a href="${checkoutUrl}" style="background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block;">Start Root-Cause Healing</a>
            </div>
            
            <p>If you're ready to address the root cause, you can secure your slot on my calendar today.</p>
            
            <p style="font-size: 13px; margin-top: 24px;">Warmly,</p>
            <p style="font-size: 14px; font-weight: bold; color: #047857; margin: 0;">Dr. Arti Singh (B.A.M.S.)</p>
          </div>
        `
      } else if (nextEmailNumber === 5) {
        emailSubject = "Closing your consultation request tomorrow — Dr. Arti Singh"
        nextScheduleHours = 0 // final step
        emailText = `Hello ${patientName},\n\nThis is my final follow-up regarding your consultation request. I will be closing this pending request tomorrow to keep my calendar open for active patients.\n\nIf you would still like to work together, you can complete checkout here: ${checkoutUrl}\n\nWishing you good health,\nDr. Arti Singh`
        emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937;">
            <p>Hello <strong>${patientName}</strong>,</p>
            
            <p>This is my final follow-up regarding your consultation request. Because I limit my weekly slots to ensure dedicated, high-quality care for each active patient, I will be closing this pending request tomorrow if checkout is not completed.</p>
            
            <p>If you are still interested in working together to address your health concerns naturally, you can secure your booking today:</p>
            
            <div style="text-align: center; margin: 24px 0;">
              <a href="${checkoutUrl}" style="background-color: #b91c1c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">Complete Consultation Booking</a>
            </div>
            
            <p>If you need more time, have questions, or would like to speak to our clinic support before completing payment, please just reply directly to this email and let me know.</p>
            
            <p style="font-size: 13px; margin-top: 24px;">Wishing you good health,</p>
            <p style="font-size: 14px; font-weight: bold; color: #b91c1c; margin: 0;">Dr. Arti Singh (B.A.M.S.)</p>
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
