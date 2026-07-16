import { notFound } from "next/navigation"
import { targetLocations, getLocationBySlug, LocationData } from "@/lib/locations"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Video, CheckCircle, Shield, Award, MapPin, ChevronRight, Activity, BookOpen, HelpCircle } from "lucide-react"

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

interface LocalizedContent {
  title: string
  content: string
  insight: string
  challenges: { title: string; description: string }[]
  faqs: { question: string; answer: string }[]
  relatedBlogs: { title: string; slug: string }[]
}

function getLocalizedContent(locData: LocationData): LocalizedContent {
  const id = locData.id
  const name = locData.name

  // Tech Hubs
  const isTechHub = ["bangalore", "hyderabad", "pune", "gurugram", "noida"].includes(id)
  // Metros
  const isMetro = ["mumbai", "delhi", "kolkata", "chennai"].includes(id)
  // UK
  const isUK = locData.country === "UK"
  // USA
  const isUSA = locData.country === "USA"
  // Middle East
  const isME = locData.country === "UAE" || locData.country === "Saudi Arabia" || locData.country === "Qatar" || locData.country === "Oman" || locData.country === "Kuwait" || locData.country === "Bahrain" || locData.region.includes("Middle East")

  if (isTechHub) {
    return {
      title: `Ayurvedic Protocols for IT & Corporate Lifestyles in ${name}`,
      content: `PCOS and PCOD symptoms in tech hubs like ${name} are closely linked to long sitting hours and late night shifts. In Ayurvedic tradition, prolonged sitting is traditionally believed to cause physical stagnation (Sanga) in the pelvic region, obstructing the downward flow of Vata. Our treatment program focus is on re-igniting your digestive fire (Agni) and introducing movement routines that help restore natural energy circulation.`,
      insight: `Focus: Restoring natural pelvic circulation & aligning daily sleep-wake patterns.`,
      challenges: [
        {
          title: "Sedentary Workplace Stagnation",
          description: "Sitting at desk jobs for 8-10 hours restricts lower abdominal circulation, encouraging Kapha-type fluid and tissue stagnation."
        },
        {
          title: "Erratic Sleep & Screen Hours",
          description: "Late evening shifts and extensive screen exposure disturb bodily biological rhythms, directly impacting cycle timing."
        },
        {
          title: "Food Delivery Dependency",
          description: "Frequent consumption of outside restaurant meals loaded with refined flour and bad fats slows down digestion (Mandagni)."
        }
      ],
      faqs: [
        {
          question: `Can I schedule consultations around my office hours in ${name}?`,
          answer: `Yes. We provide flexible early morning and late evening online consultation slots specifically to accommodate busy corporate schedules in ${name}.`
        },
        {
          question: `How can I follow the diet chart with office cafeteria food?`,
          answer: "Dr. Arti provides simple guidelines on choosing healthier local cafeteria options and quick-prep snacks that support your healing journey."
        },
        {
          question: `Does the prescription specify local grain alternatives in ${name}?`,
          answer: "Yes, the nutrition plan integrates easily available local grains like Ragi, Jowar, or Bajra, replacing refined wheat."
        }
      ],
      relatedBlogs: [
        { title: "Can Ayurveda Cure PCOS Permanently?", slug: "ayurvedic-management-pcos-guide" },
        { title: "Agni and Ayurvedic Weight Loss Tips", slug: "ayurvedic-weight-loss-tips-agni" }
      ]
    }
  }

  if (isMetro) {
    return {
      title: `Ayurvedic Strategy for Transit Stress & Metro Lifestyles in ${name}`,
      content: `Metro lifestyles in cities like ${name} involve daily commuting exhaustion, high travel stress, and frequent consumption of heavy street foods or quick-fried snacks. In Ayurveda, this combination is believed to disrupt digestive balance and accumulate Ama (metabolic waste), which underlies insulin resistance. We customize your plan to focus on blood-purifying nutrition and stress-reducing herbal support.`,
      insight: `Focus: Clearing urban metabolic toxins and stabilizing energy levels naturally.`,
      challenges: [
        {
          title: "Urban Commute Exhaustion",
          description: "Spending hours traveling causes body fatigue and mental stress, which directly elevates stress hormones (cortisol)."
        },
        {
          title: "Dependency on Commuter Street Foods",
          description: "Eating quick fried or highly refined snacks (like maida or processed sugars) spikes insulin levels, accelerating weight gain."
        },
        {
          title: "Lack of Proper Hydration",
          description: "Drinking insufficient water during travel or busy hours dry out Vata, causing gut dryness and bloating."
        }
      ],
      faqs: [
        {
          question: `Do you deliver Ayurvedic formulations to my address in ${name}?`,
          answer: `Yes, we offer express shipping. Herbal formulations usually reach your doorstep in ${name} within 24 to 48 hours.`
        },
        {
          question: `How do I manage high daily commuting stress on this program?`,
          answer: "We incorporate easy 5-minute pranayama (breathing) exercises and natural adaptogenic herbs to support your nervous system during travel hours."
        },
        {
          question: `Can I take consultations on weekends?`,
          answer: "Yes. Weekend video slots are available for busy metro professionals who cannot take calls on weekdays."
        }
      ],
      relatedBlogs: [
        { title: "PCOD vs PCOS: What's the Real Difference?", slug: "pcod-vs-pcos-ayurvedic-difference" },
        { title: "Daily Dinacharya Routine Guide", slug: "dinacharya-ayurvedic-daily-routine" }
      ]
    }
  }

  if (isUK) {
    return {
      title: `Ayurvedic Support for Cold Weather & UK Timezones in ${name}`,
      content: `Living in colder climates like the UK presents unique physiological challenges. The persistent cold, damp weather can increase bodily Kapha, while limited sunshine often leads to Vitamin D deficiencies, which are traditionally linked to sluggish insulin metabolism. Dr. Arti Singh designs customized Ayurvedic regimens with warming herbs and lifestyle advice suited to help you regulate cycles naturally.`,
      insight: `Focus: Supporting circulation, compensating for cold weather sluggishness, and active cycle care.`,
      challenges: [
        {
          title: "Temperate Damp Stagnation",
          description: "Persistent cold, wet UK weather tends to slow down bodily metabolism, accumulating sluggishness (Kapha)."
        },
        {
          title: "Limited Sunlight & Vitamin D Lack",
          description: "The lack of regular sunshine in the UK impacts Vitamin D absorption, which plays a major role in follicular development."
        },
        {
          title: "NHS waiting times for specialist care",
          description: "Patients looking for timely, private Ayurvedic guidance can book online directly with us, avoiding long waiting lists."
        }
      ],
      faqs: [
        {
          question: `How are custom Ayurvedic formulations delivered in the UK?`,
          answer: `We arrange secure shipping directly to your UK address. Estimated delivery times vary depending on the destination, customs processing, and local courier schedules, typically taking 5-9 business days.`
        },
        {
          question: `Are consultations scheduled in UK time?`,
          answer: "Yes, our online consultation calendar aligns with GMT/BST, letting you book slots convenient for your local UK routine."
        },
        {
          question: `What reports should I keep ready for the doctor?`,
          answer: "If you have recent pelvic ultrasounds, thyroid profiles, or hormone panels, you can upload them to our secure portal before your consultation."
        }
      ],
      relatedBlogs: [
        { title: "Ayurvedic Treatment for Hypothyroidism", slug: "hypothyroidism-ayurvedic-treatment-diet" },
        { title: "Can Ayurveda Cure PCOS permanently?", slug: "ayurvedic-management-pcos-guide" }
      ]
    }
  }

  if (isUSA) {
    return {
      title: `Ayurvedic Protocol for USA Busy Schedules & US Timezones in ${name}`,
      content: `For patients living in the US, high corporate stress, erratic schedules, and a reliance on quick cold diets (like frozen foods, iced drinks, or raw salads) are common triggers. In Ayurvedic tradition, dry, cold foods are believed to aggravate Vata, affecting hormonal rhythm. Our USA-specific protocol introduces grounding, warm meals and stress-balancing herbs tailored to support your wellness journey.`,
      insight: `Focus: Grounding Vata dosha, reducing mental fatigue, and warm digestive care.`,
      challenges: [
        {
          title: "High Adrenal Cortisol Burnout",
          description: "The demanding pace of US professional life keeps cortisol high, which blocks natural progesterone production."
        },
        {
          title: "Aggravation from Cold & Raw Diets",
          description: "Consuming raw cold salads, iced beverages, and refrigerated foods weakens the digestive Agni and disrupts cycles."
        },
        {
          title: "Expensive Out-of-Pocket Care",
          description: "Accessing private holistic practitioners or functional care locally is highly expensive and rarely covered by health insurance."
        }
      ],
      faqs: [
        {
          question: `How does delivery of herbal formulations work in the US?`,
          answer: "We ship laboratory-tested herbal formulations safely to the United States. Shipping times vary by destination, but packages usually clear customs and arrive in 6-10 working days."
        },
        {
          question: `Can I get video consultation slots matching my timezone?`,
          answer: "Yes, our booking platform offers dedicated slots matching US Eastern, Central, and Pacific timezones."
        },
        {
          question: `Do you support plant-based/vegan diets on this plan?`,
          answer: "Yes. Dr. Arti customizes the nutrition plan to match your personal dietary preferences, ensuring optimal plant-based protein and mineral absorption."
        }
      ],
      relatedBlogs: [
        { title: "Is Ashwagandha Good for PCOS?", slug: "is-ashwagandha-good-for-pcos" },
        { title: "Vata Pitta Kapha Dosha Quiz Guide", slug: "vata-pitta-kapha-dosha-quiz-guide" }
      ]
    }
  }

  if (isME) {
    return {
      title: `Ayurvedic Guidelines for Indoor Lifestyles & Hot Climates in ${name}`,
      content: `In hot climates like ${name} where life is spent primarily indoors under constant air conditioning, Kapha dosha gets blocked inside body channels. This causes high water retention, sluggish ovaries, and slow metabolism. We focus on dry warming spices, herbal teas that clear channel blockages (Srotas), and customized guidelines to avoid ice-cold drinks and high-glycemic foods that trigger insulin spikes.`,
      insight: `Focus: Clearing lymphatic stagnation and Kapha blockages in the ovaries.`,
      challenges: [
        {
          title: "Air Conditioning Stagnation",
          description: "Spending 90% of the day in artificial cold air constricts bodily channels, causing Kapha blockages."
        },
        {
          title: "Ice-Cold Drink Depletion",
          description: "Drinking iced beverages to combat outdoor heat instantly extinguishes your digestive fire, generating toxins."
        },
        {
          title: "High Glycemic Sweeteners",
          description: "Frequent consumption of dates, sugary drinks, or refined wheat spikes insulin, worsening hormonal acne and hirsutism."
        }
      ],
      faqs: [
        {
          question: `Do you ship Ayurvedic medicines to UAE and the Gulf countries?`,
          answer: `Yes, we regularly ship medicines to Dubai, Abu Dhabi, Riyadh, and other Gulf regions. Delivery typically takes 3 to 5 business days.`
        },
        {
          question: "Is consultation available on weekends?",
          answer: "Yes, we offer flexible weekend consultation slots to fit the Friday-Saturday or Saturday-Sunday weekend patterns in the Middle East."
        }
      ],
      relatedBlogs: [
        { title: "Can Ayurveda Cure PCOS permanently?", slug: "ayurvedic-management-pcos-guide" },
        { title: "PCOD vs PCOS Core Differences", slug: "pcod-vs-pcos-ayurvedic-difference" }
      ]
    }
  }

  // Default / Canada / Australia / Europe
  return {
    title: `Localized Ayurvedic PCOS/PCOD Consultation for ${name}`,
    content: `Ayurvedic healing is highly dependent on your local climate, environment (Desha), and regional dietary habits. In ${name}, Dr. Arti customizes your herbal formulations, daily dinacharya (routine), and cycle-regulating plans specifically to counter local environmental challenges, restoring your Dosha balance without synthetic hormones.`,
    insight: `Focus: Restoring hormonal rhythm through climate-adapted Ayurvedic therapy.`,
    challenges: [
      {
        title: "Environmental Climate Stress",
        description: "Seasonal shifts and extreme local temperatures alter bodily metabolic rates, influencing cycle timing."
      },
      {
        title: "Limited Access to Certified Specialists",
        description: "Finding certified B.A.M.S. doctors specializing in root-cause PCOS care in your local area is challenging."
      },
      {
        title: "Busy Lifestyle Obstacles",
        description: "Struggling to maintain healthy home cooking routines alongside a demanding global schedule."
      }
    ],
    faqs: [
      {
        question: `How are the herbal formulations delivered internationally?`,
        answer: "We ship all customized herbal formulations globally using certified international couriers. Custom clearance and tracking details are fully handled by us."
      },
      {
        question: `What languages are supported during consultations?`,
        answer: "Consultations are conducted in English or Hindi, depending on your comfort and preference."
      },
      {
        question: `How are prescription guidelines shared?`,
        answer: "A digital prescription copy, complete with detailed dosage guides, diet charts, and lifestyle instructions, is sent directly via email and WhatsApp."
      }
    ],
    relatedBlogs: [
      { title: "Can Ayurveda Cure PCOS permanently?", slug: "ayurvedic-management-pcos-guide" },
      { title: "PCOD vs PCOS Core Differences", slug: "pcod-vs-pcos-ayurvedic-difference" }
    ]
  }
}

function getAdjacentLocations(currentLocId: string, currentCountry: string, currentRegion: string) {
  let matches = targetLocations.filter(
    (loc) => loc.region === currentRegion && loc.id !== currentLocId
  )

  if (matches.length < 4) {
    const countryMatches = targetLocations.filter(
      (loc) => loc.country === currentCountry && loc.id !== currentLocId && !matches.find((m) => m.id === loc.id)
    )
    matches = [...matches, ...countryMatches]
  }

  return matches.slice(0, 4)
}

export default async function PcodLocationPage({ params }: LocationPageProps) {
  const { location } = await params
  const locData = getLocationBySlug(location)

  if (!locData) {
    notFound()
  }

  const regional = getLocalizedContent(locData)
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
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-serif">
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Meet Your Ayurvedic Specialist: Dr. Arti Singh</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                "PCOD cannot be treated with a generic one-size-fits-all pill. I've successfully treated hundreds of women globally by designing personalized treatment protocols based on their unique Prakriti (body constitution) and Dosha imbalances. You don't need surgery, and you don't need lifelong hormonal pills to heal."
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <span className="bg-white border border-green-200 text-green-800 text-xs px-3 py-1 rounded-full font-semibold">B.A.M.S. (Bachelor of Ayurvedic Medicine & Surgery)</span>
                <span className="bg-white border border-green-200 text-green-800 text-xs px-3 py-1 rounded-full font-semibold">Reg. No: 4200 (Bihar)</span>
                <Link href="/contact" className="inline-flex items-center text-sm font-bold text-green-700 hover:text-green-800 hover:underline">
                  Book Call with Dr. Arti <ChevronRight className="w-4 h-4 ml-0.5" />
                </Link>
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
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 font-serif">
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

      {/* Localized Lifestyle Challenges */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-serif">PCOS Lifestyle Challenges in {locData.name}</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Environmental factors, climate conditions, and local routines in {locData.name} play a significant role in hormonal health.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {regional.challenges.map((ch, idx) => (
              <div key={idx} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm mb-4">0{idx + 1}</div>
                  <h4 className="font-bold text-gray-900 mb-2">{ch.title}</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">{ch.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Localized FAQ Section */}
      <section className="py-16 bg-gray-50/30 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center font-serif">
            Frequently Asked Questions from Patients in {locData.name}
          </h3>
          <div className="space-y-6">
            {regional.faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                <h4 className="font-bold text-gray-900 mb-2 flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed pl-7.5">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Educational Guides */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif">
            Educational Guides for PCOS Reversal
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {regional.relatedBlogs.map((b, idx) => (
              <Link
                key={idx}
                href={`/blog/${b.slug}`}
                className="bg-green-50/50 hover:bg-green-50 border border-green-100 hover:border-green-200 text-green-800 text-sm font-semibold px-5 py-3.5 rounded-2xl transition-all"
              >
                {b.title} &rarr;
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Other Chronic Health Consultations */}
      <section className="py-16 bg-gray-50/50 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-serif">Ayurvedic Consultations for Other Chronic Concerns in {locData.name}</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Apart from PCOS/PCOD, patients in {locData.name} frequently consult Dr. Arti Singh for natural, root-cause recovery from these common conditions:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
              <h3 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
                🍂 Chronic Digestive & Gut Health (IBS, GERD)
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Conventional antacids and symptom blockers only mask digestive issues. Our protocol focuses on correcting your Agni (metabolic fire) and cleansing Ama (toxins) to restore natural gut balance, addressing IBS, acid reflux, and chronic bloating.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
              <h3 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
                🧠 Stress, Anxiety & Insomnia Management
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Western lifestyles drive severe adrenal fatigue. We avoid heavy sedatives and instead use traditional Ayurvedic adaptogens (Ashwagandha, Brahmi, Jatamansi) to regulate Vata dosha and naturally lower high cortisol levels.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
              <h3 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
                🌸 Chronic Skin Conditions (Eczema, Psoriasis)
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Steroid creams offer temporary relief but thin the skin. Our treatment uses traditional Rakta Shodhana (blood purification) herbs like Neem, Manjistha, and Guduchi to clear systemic toxins and soothe inflammatory flares.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
              <h3 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
                🦋 Thyroid & Metabolic Disorders
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sluggish thyroid function (hypothyroidism) is directly linked to Kapha congestion. We support your endocrine system naturally by optimizing cellular metabolism and clearing blocked energetic pathways.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Protocol */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-serif">Our 3-Step Ayurvedic PCOS Care Protocol</h2>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">Start Your Personalized Ayurvedic PCOS Journey</h2>
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
