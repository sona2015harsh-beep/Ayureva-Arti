import type { Metadata } from "next"
import PcodLandingClient from "./PcodLandingClient"

export const metadata: Metadata = {
  title: "PCOD Ayurvedic Treatment Online | Best Natural Cure by Dr. Arti Singh",
  description:
    "Get personalized online Ayurvedic treatment for PCOD/PCOS with Dr. Arti Singh. 100% natural herbs, custom diet plans, and root-cause healing. Book your consultation today.",
  keywords: [
    "PCOD ayurvedic treatment online",
    "PCOS natural cure",
    "online ayurveda consultation for PCOD",
    "best ayurvedic doctor for PCOD",
    "Dr. Arti Singh PCOD treatment",
    "Ayurveda for irregular periods",
    "natural remedies for ovarian cysts",
  ],
  alternates: {
    canonical: "/pcod-ayurvedic-treatment-online",
  },
}

export default function PcodTreatmentPage() {
  return <PcodLandingClient />
}
