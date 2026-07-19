import { Metadata } from "next"
import DiseaseLandingPage from "@/components/disease-landing-page"

export const metadata: Metadata = {
  title: "Ayurvedic PCOS & Hormonal Treatment Online | Ayureva",
  description: "Consult with Dr. Arti Singh (B.A.M.S.) for natural Ayurvedic PCOS, PCOD, and hormonal health management. Regulate cycles and improve fertility.",
  alternates: {
    canonical: "/ayurvedic-pcos-treatment",
  },
}

export default function PCOSTreatmentPage() {
  return <DiseaseLandingPage disease="pcos" />
}
