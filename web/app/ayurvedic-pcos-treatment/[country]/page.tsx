import { notFound } from "next/navigation"
import { Metadata } from "next"
import DiseaseLandingPage from "@/components/disease-landing-page"

const ALLOWED_COUNTRIES = ["usa", "uk", "canada", "australia", "uae"] as const
type AllowedCountry = typeof ALLOWED_COUNTRIES[number]

export function generateStaticParams() {
  return ALLOWED_COUNTRIES.map((country) => ({
    country,
  }))
}

interface CountryPageProps {
  params: Promise<{
    country: string
  }>
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country } = await params
  if (!ALLOWED_COUNTRIES.includes(country as any)) return {}

  const titles: Record<AllowedCountry, string> = {
    usa: "Online Ayurvedic PCOS Consultation for Patients in the USA | Ayureva",
    uk: "Ayurvedic PCOS Consultation for Patients in the UK | Ayureva",
    canada: "Online Ayurvedic PCOS Treatment for Patients in Canada | Ayureva",
    australia: "Online Ayurvedic PCOS Consultation for Patients in Australia | Ayureva",
    uae: "Online Ayurvedic PCOS Consultation for Patients in the UAE | Ayureva"
  }

  return {
    title: titles[country as AllowedCountry],
    description: `Book a private online video consultation with Dr. Arti Singh for natural Ayurvedic PCOS, PCOD, and hormonal health management in ${country.toUpperCase()}.`,
    alternates: {
      canonical: `/ayurvedic-pcos-treatment/${country}`,
    },
  }
}

export default async function PCOSTreatmentCountryPage({ params }: CountryPageProps) {
  const { country } = await params
  if (!ALLOWED_COUNTRIES.includes(country as any)) {
    notFound()
  }

  return <DiseaseLandingPage disease="pcos" country={country as AllowedCountry} />
}
