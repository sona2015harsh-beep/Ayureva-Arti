import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CheckCircle2, ShieldCheck, Calendar } from "lucide-react"

interface PageProps {
  params: Promise<{ leadId: string }>
}

export default async function SuccessPage({ params }: PageProps) {
  const { leadId } = await params

  if (!leadId) {
    notFound()
  }

  const lead = await prisma.leads.findUnique({
    where: { id: leadId },
  })

  if (!lead) {
    notFound()
  }

  // Pre-fill Calendly Link
  const CALENDLY_BASE_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/dr-arti-ayureva/1-to-1-private-consultation"
  const calendlyUrl = `${CALENDLY_BASE_URL}?name=${encodeURIComponent(lead.full_name)}&email=${encodeURIComponent(lead.email || "")}&a1=${encodeURIComponent(lead.phone_number)}`

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Success Header */}
        <div className="bg-white rounded-3xl border border-green-100 p-8 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto border border-green-200">
            <CheckCircle2 className="w-10 h-10 text-green-700" />
          </div>
          <div>
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">Payment Confirmed</span>
            <h1 className="text-3xl font-black text-gray-900 font-serif mt-3">Appointment Confirmed!</h1>
            <p className="text-xs text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
              Thank you, {lead.full_name}. We have verified your transaction. Please choose your preferred date and time slot below to schedule your private video consultation.
            </p>
          </div>
        </div>

        {/* Embedded Calendly Scheduler */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-4">
          <div className="border-b border-gray-100 pb-4 mb-4 flex items-center justify-between text-xs text-gray-500 px-2 font-medium">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-green-750" /> Select Date & Time Slot</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-750" /> Secure Checkout Verified</span>
          </div>
          <iframe
            src={calendlyUrl}
            width="100%"
            height="700px"
            frameBorder="0"
            className="w-full border-0 rounded-2xl"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
