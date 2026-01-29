import type { Metadata } from "next"
import AboutPageClient from "./AboutPageClient"

export const metadata: Metadata = {
  title: "About Dr. Arti Singh - Best Ayurveda Treatment Doctor | BAMS Qualified Women's Health Specialist | Ayureva",
  description:
    "Meet Dr. Arti Singh at Ayureva, BAMS qualified Ayurveda treatment specialist. Expert in PCOS treatment, PCOD treatment, UTI treatment, menstrual disorders treatment, fertility treatment. Clinical training at leading institutions. Book consultation at Ayureva today!",
  keywords: [
    "Dr. Arti Singh",
    "Dr. Arti Singh Ayureva",
    "BAMS doctor",
    "best ayurveda treatment doctor",
    "women's health specialist",
    "PCOS treatment doctor",
    "PCOD treatment doctor",
    "UTI treatment doctor",
    "ayurvedic gynecologist",
    "Ayureva clinic doctor",
    "fertility treatment doctor",
    "thyroid treatment doctor",
    "menstrual disorders doctor",
    "hormonal imbalance doctor",
    "online ayurvedic consultation",
    "Ayurveda treatment specialist",
    "natural treatment doctor",
    "holistic women's health doctor",
  ],
}

export default function AboutPage() {
  return <AboutPageClient />
}
