import type { Metadata } from "next"
import ServicesPageClient from "./ServicesPageClient"

export const metadata: Metadata = {
  title: "Ayurveda Treatment Services - PCOS PCOD UTI Treatment, Women's Health | Ayureva by Dr. Arti Singh",
  description:
    "Complete Ayurveda treatment services by Dr. Arti Singh: PCOS treatment, PCOD treatment, UTI treatment, menstrual disorders treatment, fertility treatment, thyroid treatment, endometriosis treatment, menopause treatment, diet & nutrition, yoga therapy. Natural & safe women's health solutions at Ayureva.",
  keywords: [
    "Ayurveda treatment services",
    "PCOS treatment ayurveda",
    "PCOD ayurvedic treatment",
    "UTI treatment ayurveda",
    "menstrual disorders treatment",
    "fertility treatment ayurveda",
    "thyroid treatment ayurveda",
    "endometriosis treatment ayurveda",
    "fibroids treatment ayurveda",
    "menopause treatment ayurveda",
    "women's health services",
    "ayurvedic diet consultation",
    "weight management ayurveda",
    "yoga therapy",
    "digestive health treatment",
    "panchakarma treatment",
    "detoxification treatment",
    "stress management treatment",
    "chronic disease management",
    "immunity building treatment",
    "anti-aging treatment",
    "sports nutrition ayurveda",
    "lifestyle coaching ayurveda",
    "Dr. Arti Singh services",
    "Ayureva treatments",
    "online ayurvedic consultation",
    "natural treatment",
    "holistic women's health",
  ],
  alternates: {
    canonical: "/services",
  },
}

export default function ServicesPage() {
  return <ServicesPageClient />
}
