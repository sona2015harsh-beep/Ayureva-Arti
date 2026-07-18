import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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

    // Target appointments completed 7 or more days ago
    const completedDateLimit = new Date()
    completedDateLimit.setDate(completedDateLimit.getDate() - 7)

    const completedApts = await prisma.appointments.findMany({
      where: {
        status: "completed",
        appointment_date: { lte: completedDateLimit },
      },
      include: {
        lead: true,
      },
    })

    const results = []

    for (const apt of completedApts) {
      // Must have associated lead with email
      if (!apt.lead || !apt.lead.email) continue

      const patientEmail = apt.lead.email
      const patientName = apt.lead.full_name.split(" ")[0]

      // Check if review request has already been sent
      const alreadySent = await prisma.communication_logs.findFirst({
        where: {
          lead_id: apt.lead_id,
          log_type: "review_request",
        },
      })

      if (alreadySent) {
        continue // Skip, review email already dispatched
      }

      // Pre-configured review page URL (Ayureva GBP Review Redirect)
      const reviewUrl = "https://g.page/r/Cdfg346t/review" 
      const emailSubject = "Review Your Consultation with Dr. Arti Singh | Ayureva"

      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="https://www.ayureva.in/icon.png" alt="Ayureva Logo" style="height: 48px;" />
            <h2 style="color: #047857; margin-top: 12px; font-size: 22px;">Share Your Recovery Feedback</h2>
          </div>
          
          <p>Dear <strong>${patientName}</strong>,</p>
          
          <p>We hope you are feeling better and experiencing positive changes in your pelvic health and vitality since your consultation with <strong>Dr. Arti Singh</strong>.</p>
          
          <p>Ayurvedic healing is a patient journey. By sharing your recovery experience, you help other women struggling with PCOS, heavy bleeding, thyroid, or gut disorders find safe, natural pathways to healing.</p>
          
          <p style="font-size: 14px; font-weight: bold; text-align: center; margin-top: 24px;">Could you take 1 minute to leave a review on our Google page?</p>
          
          <div style="text-align: center; margin: 24px 0;">
            <a href="${reviewUrl}" style="background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">Leave a Google Review</a>
          </div>
          
          <p style="font-size: 12px; color: #6b7280; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 24px;">
            If you need any follow-up support regarding your current prescriptions, feel free to reply directly to this email or contact us on WhatsApp.
          </p>
        </div>
      `

      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Ayureva <onboarding@resend.dev>",
            to: [patientEmail],
            subject: emailSubject,
            text: `Hello ${patientName},\n\nWe hope you are feeling better. Please take 1 minute to review your consultation on Google: ${reviewUrl}\n\nThank you,\nDr. Arti Singh\nAyureva Clinic`,
            html: emailHtml,
          }),
        })

        if (res.ok) {
          // Log email to database communication logs to prevent duplicates
          await prisma.communication_logs.create({
            data: {
              lead_id: apt.lead_id,
              type: "email",
              log_type: "review_request",
              message: "Sent automated Google Business Profile review request email 7 days post-appointment.",
              status: "sent",
            },
          })

          results.push({ leadId: apt.lead_id, status: "success" })
        } else {
          const errText = await res.text()
          console.error(`Failed to send review request to ${patientEmail}:`, res.status, errText)
          results.push({ leadId: apt.lead_id, status: "failed", error: errText })
        }
      } catch (err) {
        console.error(`Error sending review request to lead ${apt.lead_id}:`, err)
        results.push({ leadId: apt.lead_id, status: "error", error: String(err) })
      }
    }

    return NextResponse.json({ success: true, processed: completedApts.length, results })
  } catch (error) {
    console.error("Reviews cron worker runtime error:", error)
    return NextResponse.json({ error: "Reviews cron worker failed" }, { status: 500 })
  }
}
