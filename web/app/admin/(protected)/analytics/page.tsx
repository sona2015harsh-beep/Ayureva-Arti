import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, FileText, CreditCard, Award, ArrowUpRight, BarChart3, Mail, RefreshCw } from "lucide-react"

export default async function AnalyticsPage() {
  // 1. Verify Admin Auth Role
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/admin/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    redirect("/admin/login?error=not-admin")
  }

  // 2. Query Analytics & Leads Data
  const now = new Date()

  // Fetch unique sessions
  const uniqueSessionsResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(DISTINCT session_id) as count FROM funnel_events WHERE event_type = 'landing_page_view'
  `
  const totalSessions = Number(uniqueSessionsResult[0]?.count || 0)

  // Fetch form starts
  const formStartedResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(DISTINCT session_id) as count FROM funnel_events WHERE event_type = 'form_started'
  `
  const totalFormStarts = Number(formStartedResult[0]?.count || 0)

  // Fetch form submissions
  const formSubmittedResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(DISTINCT session_id) as count FROM funnel_events WHERE event_type = 'form_submitted'
  `
  const totalFormSubmissions = Number(formSubmittedResult[0]?.count || 0)

  // Fetch payment initiations
  const paymentInitiatedResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(DISTINCT session_id) as count FROM funnel_events WHERE event_type = 'payment_initiated'
  `
  const totalPaymentInitiations = Number(paymentInitiatedResult[0]?.count || 0)

  // Fetch payment completions
  const paymentCompletedResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(DISTINCT session_id) as count FROM funnel_events WHERE event_type = 'payment_completed'
  `
  const totalPaymentCompletions = Number(paymentCompletedResult[0]?.count || 0)

  // Fetch all leads
  const allLeads = await prisma.leads.findMany({
    orderBy: { created_at: "desc" },
  })

  // Calculations
  const pendingPaymentsCount = allLeads.filter(l => l.status === "pending").length
  const totalPaidBookings = allLeads.filter(l => ["paid", "booked", "converted"].includes(l.status || "")).length
  const totalRevenue = allLeads
    .filter(l => ["paid", "booked", "converted"].includes(l.status || ""))
    .reduce((sum, l) => sum + (l.payment_amount || 0), 0)

  // Lead recovery statistics
  const totalRecoveryEmailsSent = allLeads.reduce((sum, l) => sum + (l.recovery_emails_sent || 0), 0)
  const recoveredPatients = allLeads.filter(
    l => ["paid", "booked", "converted"].includes(l.status || "") && l.recovered_by_email === true
  )
  const totalRecoveredRevenue = recoveredPatients.reduce((sum, l) => sum + (l.payment_amount || 0), 0)
  const recoveryConversionRate = pendingPaymentsCount + recoveredPatients.length > 0 
    ? Math.round((recoveredPatients.length / (pendingPaymentsCount + recoveredPatients.length)) * 100)
    : 0

  // 3. Email-by-Email recovery stats (Which step recovered the patient)
  const recoveryEmailPerformance: Record<string, number> = {
    email_2: 0,
    email_3: 0,
    email_4: 0,
    email_5: 0,
  }
  recoveredPatients.forEach((l) => {
    if (l.last_recovery_email_sent && l.last_recovery_email_sent in recoveryEmailPerformance) {
      recoveryEmailPerformance[l.last_recovery_email_sent]++
    }
  })

  // 4. Landing Page Performance calculations
  // Get all form submission events mapping leadId -> page_path
  const formEvents = await prisma.funnel_events.findMany({
    where: { event_type: "form_submitted" },
  })

  const leadToPathMap: Record<string, string> = {}
  formEvents.forEach((evt) => {
    try {
      const meta = evt.metadata as any
      if (meta && meta.leadId) {
        leadToPathMap[meta.leadId] = evt.page_path
      }
    } catch (e) {
      // ignore parsing errors
    }
  })

  // Get views count per page path
  const pageViews = await prisma.$queryRaw<Array<{ page_path: string; count: bigint }>>`
    SELECT page_path, COUNT(DISTINCT session_id) as count
    FROM funnel_events
    WHERE event_type = 'landing_page_view'
    GROUP BY page_path
  `

  const pageMetrics: Record<string, { path: string; views: number; formSubmissions: number; bookings: number; revenue: number }> = {}

  pageViews.forEach((pv) => {
    pageMetrics[pv.page_path] = {
      path: pv.page_path,
      views: Number(pv.count),
      formSubmissions: 0,
      bookings: 0,
      revenue: 0,
    }
  })

  // Map lead submissions/revenues back to their landing page paths
  allLeads.forEach((lead) => {
    const originalPath = leadToPathMap[lead.id] || "/contact" // fallback to contact page if not mapped
    if (!pageMetrics[originalPath]) {
      pageMetrics[originalPath] = {
        path: originalPath,
        views: 0,
        formSubmissions: 0,
        bookings: 0,
        revenue: 0,
      }
    }
    
    pageMetrics[originalPath].formSubmissions++
    
    if (["paid", "booked", "converted"].includes(lead.status || "")) {
      pageMetrics[originalPath].bookings++
      pageMetrics[originalPath].revenue += lead.payment_amount || 0
    }
  })

  const sortedPageMetrics = Object.values(pageMetrics).sort((a, b) => b.views - a.views)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-serif">Consultation Funnel Analytics</h1>
          <p className="text-gray-500 mt-1">Measure patient acquisitions, landing page conversions, and email recovery stats.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <span>Active Session tracking enabled</span>
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-green-150 shadow-xs">
          <CardContent className="p-5 flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Traffic (Sessions)</span>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-3xl font-black text-green-950">{totalSessions}</span>
              <Users className="w-5 h-5 text-green-700" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-green-150 shadow-xs">
          <CardContent className="p-5 flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completed Bookings</span>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-3xl font-black text-green-700">{totalPaidBookings}</span>
              <Award className="w-5 h-5 text-green-700" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-green-150 shadow-xs">
          <CardContent className="p-5 flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Revenue Generated</span>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-3xl font-black text-indigo-700">₹{totalRevenue.toLocaleString("en-IN")}</span>
              <CreditCard className="w-5 h-5 text-indigo-700" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-green-150 shadow-xs">
          <CardContent className="p-5 flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Recovered Revenue</span>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-3xl font-black text-emerald-700">₹{totalRecoveredRevenue.toLocaleString("en-IN")}</span>
              <Mail className="w-5 h-5 text-emerald-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Split Funnel and Email Sequence section */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Friction Funnel (9 cols) */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-900 font-serif flex items-center gap-1.5"><BarChart3 className="w-5 h-5 text-green-700" /> Patient Intake Friction Funnel</h3>
          <div className="space-y-5">
            {/* Session -> Form Start */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                <span>1. Landed on Website (Views)</span>
                <span>{totalSessions} sessions</span>
              </div>
              <div className="w-full bg-gray-100 h-6 rounded-full overflow-hidden flex items-center relative">
                <div className="bg-green-700 h-full rounded-full transition-all duration-300" style={{ width: "100%" }}></div>
                <span className="absolute right-3 text-2xs font-bold text-gray-700">100%</span>
              </div>
            </div>

            {/* Form Started */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                <span>2. Began Booking (Form Started)</span>
                <span>{totalFormStarts} sessions ({totalSessions > 0 ? Math.round((totalFormStarts / totalSessions) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-gray-100 h-6 rounded-full overflow-hidden flex items-center relative">
                <div className="bg-green-600 h-full rounded-full transition-all duration-300" style={{ width: `${totalSessions > 0 ? (totalFormStarts / totalSessions) * 100 : 0}%` }}></div>
                <span className="absolute right-3 text-2xs font-bold text-gray-700">{totalSessions > 0 ? Math.round((totalFormStarts / totalSessions) * 100) : 0}%</span>
              </div>
            </div>

            {/* Form Submitted */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                <span>3. Submitted Info (Lead Saved)</span>
                <span>{totalFormSubmissions} sessions ({totalFormStarts > 0 ? Math.round((totalFormSubmissions / totalFormStarts) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-gray-100 h-6 rounded-full overflow-hidden flex items-center relative">
                <div className="bg-emerald-600 h-full rounded-full transition-all duration-300" style={{ width: `${totalSessions > 0 ? (totalFormSubmissions / totalSessions) * 100 : 0}%` }}></div>
                <span className="absolute right-3 text-2xs font-bold text-gray-700">{totalSessions > 0 ? Math.round((totalFormSubmissions / totalSessions) * 100) : 0}%</span>
              </div>
            </div>

            {/* Payment Success */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                <span>4. Paid Consultation Fee (Conversion)</span>
                <span>{totalPaidBookings} bookings ({totalFormSubmissions > 0 ? Math.round((totalPaidBookings / totalFormSubmissions) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-gray-100 h-6 rounded-full overflow-hidden flex items-center relative">
                <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${totalSessions > 0 ? (totalPaidBookings / totalSessions) * 100 : 0}%` }}></div>
                <span className="absolute right-3 text-2xs font-bold text-gray-700">{totalSessions > 0 ? Math.round((totalPaidBookings / totalSessions) * 100) : 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Email Recovery Performance (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 font-serif flex items-center gap-1.5 mb-2"><Mail className="w-5 h-5 text-emerald-700" /> Recovery sequence</h3>
            <p className="text-2xs text-gray-500 leading-relaxed mb-6">Patient yield recovered by each configurable sequence email template.</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-medium border-b pb-2.5">
                <span className="text-gray-600">Email 2 (24 hr Complete Booking)</span>
                <span className="font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">{recoveryEmailPerformance.email_2} recovered</span>
              </div>
              <div className="flex justify-between items-center text-xs font-medium border-b pb-2.5">
                <span className="text-gray-600">Email 3 (48 hr Common FAQs)</span>
                <span className="font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">{recoveryEmailPerformance.email_3} recovered</span>
              </div>
              <div className="flex justify-between items-center text-xs font-medium border-b pb-2.5">
                <span className="text-gray-600">Email 4 (Day 4 Reassurance)</span>
                <span className="font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">{recoveryEmailPerformance.email_4} recovered</span>
              </div>
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-gray-600">Email 5 (Day 7 Final Notice)</span>
                <span className="font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">{recoveryEmailPerformance.email_5} recovered</span>
              </div>
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mt-6 text-2xs text-emerald-800 leading-relaxed">
            <strong>Recovery Summary:</strong> Sent {totalRecoveryEmailsSent} recovery emails, successfully recovered <strong>{recoveredPatients.length} abandoned checkout bookings</strong> with an overall recovery rate of <strong>{recoveryConversionRate}%</strong>.
          </div>
        </div>
      </div>

      {/* Landing Page Performance Yield (Table) */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 font-serif flex items-center gap-1.5"><ArrowUpRight className="w-5 h-5 text-indigo-700" /> Commercial Landing Page Performance</h3>
        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-2xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50 text-xs font-semibold">
                <TableHead className="py-3 font-semibold text-gray-600">Landing Page Path</TableHead>
                <TableHead className="py-3 font-semibold text-gray-600 text-center">Unique Views</TableHead>
                <TableHead className="py-3 font-semibold text-gray-600 text-center">Form Submissions</TableHead>
                <TableHead className="py-3 font-semibold text-gray-600 text-center">Paid Bookings</TableHead>
                <TableHead className="py-3 font-semibold text-gray-600 text-center">Conversion %</TableHead>
                <TableHead className="py-3 font-semibold text-gray-600 text-right">Revenue Generated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPageMetrics.map((pv, idx) => {
                const convRate = pv.views > 0 ? Math.round((pv.bookings / pv.views) * 100) : 0
                return (
                  <TableRow key={idx} className="hover:bg-gray-55/40 text-xs">
                    <TableCell className="font-bold text-gray-900">{pv.path}</TableCell>
                    <TableCell className="text-center font-semibold text-gray-600">{pv.views}</TableCell>
                    <TableCell className="text-center font-semibold text-gray-600">{pv.formSubmissions}</TableCell>
                    <TableCell className="text-center font-semibold text-green-700">{pv.bookings}</TableCell>
                    <TableCell className="text-center font-bold text-indigo-700">{convRate}%</TableCell>
                    <TableCell className="text-right font-black text-gray-900">₹{pv.revenue.toLocaleString("en-IN")}</TableCell>
                  </TableRow>
                )
              })}
              {sortedPageMetrics.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-gray-400 font-medium">
                    No page-level navigation events logged.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
