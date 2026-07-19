import { notFound } from "next/navigation"
import { Metadata } from "next"
import DiseaseLandingPage from "@/components/disease-landing-page"

const ALLOWED_COUNTRIES = ["usa", "uk", "canada", "uae"] as const
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
    usa: "Online Ayurvedic Thyroid Consultation for Patients in the USA | Ayureva",
    uk: "Ayurvedic Thyroid Consultation for Patients in the UK | Ayureva",
    canada: "Online Ayurvedic Thyroid Treatment for Patients in Canada | Ayureva",
    uae: "Online Ayurvedic Thyroid Consultation for Patients in the UAE | Ayureva"
  }

  return {
    title: titles[country as AllowedCountry],
    description: `Book a private online video consultation with Dr. Arti Singh for natural Ayurvedic hypothyroidism and sluggish thyroid management in ${country.toUpperCase()}.`,
    alternates: {
      canonical: `/ayurvedic-thyroid-treatment/${country}`,
    },
  }
}

export default async function ThyroidTreatmentCountryPage({ params }: CountryPageProps) {
  const { country } = await params
  if (!ALLOWED_COUNTRIES.includes(country as any)) {
    notFound()
  }

  return <DiseaseLandingPage disease="thyroid" country={country as AllowedCountry} />
}
