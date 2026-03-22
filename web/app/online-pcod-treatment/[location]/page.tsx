import { notFound } from "next/navigation"
import { targetLocations, getLocationBySlug } from "@/lib/locations"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Video, CheckCircle, Shield, Award, MapPin } from "lucide-react"

interface LocationPageProps {
  params: Promise<{
    location: string
  }>
}

export async function generateStaticParams() {
  return targetLocations.map((loc) => ({
    location: loc.id,
  }))
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { location } = await params
  const locData = getLocationBySlug(location)

  if (!locData) {
    return {}
  }

  const title = `Best Ayurvedic Doctor for PCOD in ${locData.name} | Online Consultation with Dr. Arti Singh`
  const description = `Looking for the best Ayurvedic treatment for PCOD/PCOS in ${locData.name}, ${locData.state}? Book a 1-on-1 secure online video consultation with expert Dr. Arti Singh, B.A.M.S.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://ayureva.in/online-pcod-treatment/${locData.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://ayureva.in/online-pcod-treatment/${locData.id}`,
      type: "website",
    },
  }
}

export default async function PcodLocationPage({ params }: LocationPageProps) {
  const { location } = await params
  const locData = getLocationBySlug(location)

  if (!locData) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: `Ayureva PCOD Clinic - Serving ${locData.name}`,
    description: `Online Ayurvedic PCOD/PCOS clinic offering specialized video consultations for patients in ${locData.name}, ${locData.state}.`,
    url: `https://ayureva.in/online-pcod-treatment/${locData.id}`,
    medicalSpecialty: "Ayurvedic Treatment for PCOD",
    availableService: {
      "@type": "MedicalTherapy",
      name: `Online PCOD Consultation for ${locData.name} Residents`,
    },
    areaServed: {
      "@type": "City",
      name: locData.name,
      containedInPlace: {
        "@type": "State",
        name: locData.state,
      },
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16 lg:py-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5">
          <MapPin className="w-96 h-96 text-green-900" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Video className="w-4 h-4" />
              Now seeing patients across {locData.name}, {locData.state}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Best Ayurvedic Treatment for PCOD in <span className="text-green-600">{locData.name}</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Skip the clinic wait times. Get a customized, root-cause Ayurvedic treatment plan for your PCOS/PCOD securely from the comfort of your home in {locData.region}.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-8 bg-green-600 hover:bg-green-700 text-white text-lg font-bold shadow-xl transition-all hover:scale-105 rounded-full" asChild>
                <Link href="/contact">
                  <Calendar className="w-5 h-5 mr-3" />
                  Book Video Consultation
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" /> Secure HD Video Call
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-green-500" /> Certified B.A.M.S. Doctor
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Doorstep Medicine Delivery available to {locData.name}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Authority Block */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-green-50/50 p-8 rounded-3xl">
            <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
              <Image 
                src="/dr-arti-singh.jpg" 
                alt="Dr. Arti Singh" 
                fill 
                className="object-cover" 
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Meet Your Ayurvedic Specialist: Dr. Arti Singh</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                "PCOD cannot be treated with a generic one-size-fits-all pill. I've successfully treated hundreds of women globally by designing personalized treatment protocols based on their unique Prakriti (body constitution) and Dosha imbalances. You don't need surgery, and you don't need lifelong hormonal pills to heal."
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-white border border-green-200 text-green-800 text-xs px-3 py-1 rounded-full font-semibold">B.A.M.S. Certified</span>
                <span className="bg-white border border-green-200 text-green-800 text-xs px-3 py-1 rounded-full font-semibold">10+ Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Protocol */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">The 3-Step Ayurvedic PCOD Protocol</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">How we naturally dissolve cysts, regulate your menstrual cycle, and restore fertility without clinical side effects.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xl mb-4">1</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Agni Correction</h3>
              <p className="text-gray-600 text-sm">We rebuild your metabolic fire to reverse insulin resistance—the primary driver behind PCOD weight gain and hormonal chaos.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xl mb-4">2</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Granthi Bhedana (Cyst Dissolving)</h3>
              <p className="text-gray-600 text-sm">Targeted herbal formulations (like Kanchanar Guggulu) physically reduce and dissolve existing ovarian follicles and cysts naturally.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xl mb-4">3</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Artava Janana (Cycle Regulation)</h3>
              <p className="text-gray-600 text-sm">Once the channels are clear, we nourish the reproductive system to trigger painless, timely, and natural ovulation every month.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-green-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to regain control of your hormones?</h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto text-lg">
            Join hundreds of women from {locData.country} who have successfully reversed their PCOD with Ayureva.
          </p>
          <Button size="lg" className="h-14 px-8 bg-white hover:bg-gray-100 text-green-900 text-lg font-bold shadow-xl rounded-full" asChild>
            <Link href="/contact">
              <Calendar className="w-5 h-5 mr-3" />
              Schedule Your {locData.name} Consultation
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
