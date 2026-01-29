
import ContactSection from "@/components/contact-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Ayureva - Book Consultation with Dr. Arti Singh | Best Ayurveda Treatment Doctor",
  description:
    "Contact Dr. Arti Singh at Ayureva for PCOS treatment, PCOD treatment, UTI treatment, menstrual disorders treatment, fertility treatment, thyroid treatment. Book online consultation: Email: drartisingh1102@gmail.com | Ayureva.in",
  keywords: [
    "contact ayurveda treatment doctor",
    "book consultation Dr. Arti Singh",
    "PCOS treatment doctor appointment",
    "PCOD treatment doctor appointment",
    "UTI treatment doctor appointment",
    "Ayureva clinic contact",
    "women's health specialist contact",
    "fertility treatment doctor contact",
    "thyroid treatment doctor contact",
    "menstrual disorders doctor contact",
    "online ayurvedic consultation",
    "Ayurveda treatment appointment",
    "natural treatment consultation",
  ],
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">

      <ContactSection />

    </div>
  )
}
