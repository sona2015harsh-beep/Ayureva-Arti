import { Metadata } from "next"
import OvulationCalculatorClient from "./OvulationCalculatorClient"

export const metadata: Metadata = {
  title: "Ovulation & Fertile Window Calculator | Ayureva",
  description: "Calculate your fertile window, expected ovulation day, and next cycle start. Discover Ayurvedic insights for preconception wellness under Dr. Arti Singh.",
  alternates: {
    canonical: "/tools/ovulation-calculator",
  },
}

export default function OvulationCalculatorPage() {
  return <OvulationCalculatorClient />
}
