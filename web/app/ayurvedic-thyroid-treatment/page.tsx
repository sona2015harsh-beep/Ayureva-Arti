import { Metadata } from "next"
import DiseaseLandingPage from "@/components/disease-landing-page"

export const metadata: Metadata = {
  title: "Ayurvedic Thyroid (Hypothyroidism) Treatment | Ayureva",
  description: "Consult with Dr. Arti Singh (B.A.M.S.) for natural Ayurvedic thyroid and hypothyroidism treatment. Clear glandular blockages and ignite metabolism.",
  alternates: {
    canonical: "/ayurvedic-thyroid-treatment",
  },
}

export default function ThyroidTreatmentPage() {
  return <DiseaseLandingPage disease="thyroid" />
}
