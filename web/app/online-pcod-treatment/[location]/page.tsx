import { notFound } from "next/navigation"
import { targetLocations, getLocationBySlug } from "@/lib/locations"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Video, CheckCircle, Shield, Award, MapPin, ChevronRight, Activity } from "lucide-react"

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

  const title = `Online Ayurvedic Consultation for PCOS in ${locData.name} | Dr. Arti Singh`
  const description = `Consult with expert Ayurvedic physician Dr. Arti Singh (B.A.M.S.) online from ${locData.name}, ${locData.state}. Get personalized Ayurvedic care for PCOS/PCOD and hormonal wellness.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.ayureva.in/online-pcod-treatment/${locData.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.ayureva.in/online-pcod-treatment/${locData.id}`,
      type: "website",
    },
  }
}

function getRegionalContent(region: string) {
  const isCold = region.includes("USA") || region.includes("UK") || region.includes("Canada") || region.includes("United Kingdom") || region.includes("Northeast") || region.includes("Midwest") || region.includes("Coast") || region.includes("Europe");
  const isMiddleEast = region.includes("Middle East");
  const isIndia = region.includes("India");

  if (isCold) {
    return {
      title: `Ayurvedic Care for Cold & Temperate Climates (${region})`,
      content: "Living in colder regions often leads to Vitamin D deficiency, which is directly linked to insulin resistance and worsening PCOS/PCOD symptoms. In cold climates, bodily Agni (metabolic fire) gets sluggish. Dr. Arti's customized protocol for this region includes specific warming herbs (like Ginger, Cinnamon, and Pippali) and a strict recommendation to avoid cold/iced beverages, which deplete your metabolic fire.",
      insight: "Focus: Boosting Agni & correcting Vitamin D absorption naturally."
    }
  }

  if (isMiddleEast) {
    return {
      title: `Ayurvedic Strategy for Hot Climates & Indoor Lifestyles (${region})`,
      content: "In extremely hot climates where daily life is spent mostly indoors under constant air conditioning, Kapha dosha can easily accumulate. This leads to water retention, slow metabolism, and sluggish ovulation. Our treatment for Middle Eastern patients emphasizes dry-brushing (Udvarthanam), specific warming spices to clear channels (Srotas), and strict guidelines to avoid ice-cold drinks and high-glycemic dates.",
      insight: "Focus: Clearing water retention and stimulating Kapha-blocked metabolism."
    }
  }

  if (isIndia) {
    return {
      title: `Ayurvedic Guidelines for Traditional Indian Diets (${region})`,
      content: "Modern Indian dietary habits have shifted toward highly refined carbohydrates (polished white rice, refined wheat flour/maida), leading to a high prevalence of insulin resistance (the root driver of PCOD weight gain). Dr. Arti's protocol focuses on correcting your Agni by replacing refined grains with local millets (Jowar, Bajra, Ragi) and integrating insulin-sensitizing herbs like Methi (Fenugreek) and Haridra (Turmeric).",
      insight: "Focus: Reversing insulin resistance through native grain optimization."
    }
  }

  return {
    title: `Localized Ayurvedic Protocol for ${region}`,
    content: "Ayurveda is a science of relativity. The local climate, water, and regional dietary habits (Desha) heavily influence your bodily Doshas. Dr. Arti Singh customizes your Ayurvedic formulations, herbal teas, and daily dinacharya (routine) specifically to match the season, temperature, and lifestyle patterns of your local geographical region.",
    insight: "Focus: Climate-compatible dosha balancing (Desha Satmya)."
  }
}

function getAdjacentLocations(currentLocId: string, currentCountry: string, currentRegion: string) {
  let matches = targetLocations.filter(
    (loc) => loc.region === currentRegion && loc.id !== currentLocId
  );

  if (matches.length < 4) {
    const countryMatches = targetLocations.filter(
      (loc) => loc.country === currentCountry && loc.id !== currentLocId && !matches.find((m) => m.id === loc.id)
    );
    matches = [...matches, ...countryMatches];
  }

  return matches.slice(0, 4);
}

export default async function PcodLocationPage({ params }: LocationPageProps) {
  const { location } = await params
  const locData = getLocationBySlug(location)

  if (!locData) {
    notFound()
  }

  const regional = getRegionalContent(locData.region)
  const adjacent = getAdjacentLocations(locData.id, locData.country, locData.region)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: `Ayureva PCOD Clinic - Serving ${locData.name}`,
    description: `Online Ayurvedic PCOD/PCOS clinic offering specialized video consultations for patients in ${locData.name}, ${locData.state}.`,
    url: `https://www.ayureva.in/online-pcod-treatment/${locData.id}`,
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
              Ayurvedic PCOS Care & Online Consultation in <span className="text-green-600">{locData.name}</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get a personalized Ayurvedic care plan and wellness guidance for PCOS/PCOD securely from the comfort of your home in {locData.region}.
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
                <span className="bg-white border border-green-200 text-green-800 text-xs px-3 py-1 rounded-full font-semibold">Reg. No: 0045 (Bihar)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Localized Health Insights Section */}
      <section className="py-12 bg-green-50/20 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-green-100 shadow-xs">
            <div className="flex items-center gap-2.5 text-green-700 mb-3 font-semibold text-sm uppercase tracking-wider">
              <Activity className="w-5 h-5" />
              <span>Ayurvedic Regional Assessment</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              {regional.title}
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4 text-sm md:text-base">
              {regional.content}
            </p>
            <div className="bg-green-50 border-l-4 border-green-600 p-3.5 rounded-r-xl text-sm font-semibold text-green-950">
              💡 {regional.insight}
            </div>
          </div>
        </div>
      </section>

      {/* The Protocol */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our 3-Step Ayurvedic PCOS Care Protocol</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Focusing on metabolism correction, natural cycle regulation, and hormonal balance through customized herbal advice.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xl mb-4">1</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Agni Correction</h3>
              <p className="text-gray-600 text-sm">We rebuild your metabolic fire to reverse insulin resistance—the primary driver behind PCOD weight gain and hormonal chaos.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xl mb-4">2</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Ovarian Channel Cleansing</h3>
              <p className="text-gray-600 text-sm">Supporting the body's natural processes using traditional herbs like Kanchanar Guggulu to clear Kapha accumulation and balance ovarian energy.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xl mb-4">3</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Artava Janana (Cycle Regulation)</h3>
              <p className="text-gray-600 text-sm">Once the channels are clear, we nourish the reproductive system to trigger painless, timely, and natural ovulation every month.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sideways Internal Linking (Crawl Graph) */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-green-700 mb-6 text-center">
            Other Online Consultations in {locData.country}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {adjacent.map((adj) => (
              <Link
                key={adj.id}
                href={`/online-pcod-treatment/${adj.id}`}
                className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-green-300 hover:bg-green-50/20 transition-all text-center"
              >
                <div className="w-full text-center">
                  <span className="font-semibold text-gray-800 text-sm block">
                    {adj.name}
                  </span>
                  <span className="text-xs text-gray-400 block mt-0.5">
                    {adj.state}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/online-pcod-treatment"
              className="inline-flex items-center text-sm font-bold text-green-600 hover:underline animate-pulse-subtle"
            >
              View All Serviced Areas <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-green-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Personalized Ayurvedic PCOS Journey</h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto text-lg">
            Consult with Dr. Arti Singh and get customized diet, lifestyle, and traditional herbal guidance suited for {locData.country}.
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
