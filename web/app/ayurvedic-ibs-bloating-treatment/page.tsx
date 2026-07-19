import { Metadata } from "next"
import DiseaseLandingPage from "@/components/disease-landing-page"

export const metadata: Metadata = {
  title: "Ayurvedic IBS & Chronic Bloating Treatment Online | Ayureva",
  description: "Consult with Dr. Arti Singh (B.A.M.S.) for natural Ayurvedic IBS, bloating, and digestive health management. Rebuild gut fire (Agni) and clear toxins.",
  alternates: {
    canonical: "/ayurvedic-ibs-bloating-treatment",
  },
}

export default function IBSBloatingTreatmentPage() {
  return <DiseaseLandingPage disease="ibs" />
}
