import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import PayPageClient from "./PayPageClient"

interface PageProps {
  params: Promise<{ leadId: string }>
}

export default async function PayPage({ params }: PageProps) {
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

  // If they already paid, send them directly to the confirmation success page
  if (lead.status === "paid" || lead.status === "booked" || lead.status === "converted") {
    redirect(`/pay/${leadId}/success`)
  }

  // Serialize dates for client component
  const serializedLead = {
    id: lead.id,
    full_name: lead.full_name,
    email: lead.email || "",
    phone_number: lead.phone_number,
    message: lead.message || "",
    status: lead.status || "pending",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PayPageClient lead={serializedLead} />
    </div>
  )
}
