import { Metadata } from "next"
import PCOSSymptomCheckerClient from "./PCOSSymptomCheckerClient"

export const metadata: Metadata = {
  title: "PCOS / PCOD Symptom Checker & Risk Assessment | Ayureva",
  description: "Assess your risk of PCOS and PCOD with our 5-step clinical checker. Discover Kapha-Vata blocks and schedule a root-cause consultation with Dr. Arti Singh.",
  alternates: {
    canonical: "/tools/pcos-symptom-checker",
  },
}

export default function PCOSSymptomCheckerPage() {
  return <PCOSSymptomCheckerClient />
}
