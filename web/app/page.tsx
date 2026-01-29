import type { Metadata } from "next"
import ClientPage from "./ClientPage"

export const metadata: Metadata = {
  title: "Ayureva - Best Ayurveda Treatment | PCOS PCOD UTI Treatment by Dr. Arti Singh",
  description:
    "Ayureva by Dr. Arti Singh - Leading Ayurveda treatment specialist offers natural PCOS treatment, PCOD treatment, UTI treatment, menstrual disorders treatment, fertility treatment, thyroid treatment. Visit Ayureva.in for online consultation today!",
  keywords: [
    "Ayureva",
    "Ayureva.in",
    "Ayureva clinic",
    "Ayureva Dr Arti Singh",
    "Ayureva Patna",
    "Ayurveda treatment",
    "best ayurvedic doctor",
    "PCOS treatment",
    "PCOS treatment ayurveda",
    "PCOD treatment",
    "PCOD ayurvedic treatment",
    "UTI treatment",
    "UTI treatment ayurveda",
    "menstrual disorders treatment",
    "menstrual problems doctor",
    "fertility treatment",
    "fertility treatment ayurveda",
    "thyroid treatment",
    "thyroid treatment ayurveda",
    "endometriosis treatment",
    "fibroids treatment",
    "menopause treatment",
    "women's health specialist",
    "Dr. Arti Singh Ayureva",
    "natural treatment",
    "hormonal imbalance treatment",
    "online ayurvedic consultation",
    "Ayureva women's health",
    "ayurvedic diet",
    "weight management ayurveda",
    "yoga therapy",
    "digestive health treatment",
  ],
  openGraph: {
    title: "Ayureva - Best Ayurveda Treatment | PCOS PCOD UTI Treatment by Dr. Arti Singh",
    description:
      "Ayureva by Dr. Arti Singh offers specialized Ayurveda treatment for PCOS treatment, PCOD treatment, UTI treatment, menstrual disorders. Visit Ayureva.in for natural, safe & effective solutions.",
    url: "https://ayureva.in",
    siteName: "Ayureva",
    images: ["/ayurvedic-doctor.png"],
  },
  alternates: {
    canonical: "/",
  },
}

export default function HomePage() {
  return <ClientPage />
}
