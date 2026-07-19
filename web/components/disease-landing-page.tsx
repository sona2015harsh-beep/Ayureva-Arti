"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Calendar, CheckCircle2, Star, Clock, FileText, Check } from "lucide-react"
import { useGeoPricing } from "@/hooks/use-geo-pricing"

interface DiseaseLandingPageProps {
  disease: "pcos" | "thyroid" | "ibs"
  country?: "usa" | "uk" | "canada" | "uae" | "australia"
}

export default function DiseaseLandingPage({ disease, country }: DiseaseLandingPageProps) {
  const { pricing: dynamicPricing } = useGeoPricing()

  // 1. Localized pricing rules
  const getPricingInfo = () => {
    if (country === "usa") return { currency: "USD", amount: 99, symbol: "$", label: "$99 USD" }
    if (country === "uk") return { currency: "GBP", amount: 79, symbol: "£", label: "£79 GBP" }
    if (country === "canada") return { currency: "USD", amount: 99, symbol: "$", label: "$99 USD" }
    if (country === "uae") return { currency: "AED", amount: 249, symbol: "AED ", label: "249 AED" }
    if (country === "australia") return { currency: "USD", amount: 99, symbol: "$", label: "$99 USD" }
    
    // Default to dynamic detection for parent pages
    return dynamicPricing
  }

  const pricing = getPricingInfo()

  // 2. Metadata definitions
  const diseaseInfo = {
    pcos: {
      title: "PCOS & Hormonal Health",
      h1: "Online Ayurvedic PCOS & Hormonal Health Consultation",
      tagline: "Regulate your cycles, address insulin resistance, and balance hormones naturally under the guidance of Dr. Arti Singh.",
      symptoms: [
        "Irregular, delayed, or missed menstrual cycles",
        "Persistent acne along the jawline and hormonal breakouts",
        "Difficulty managing weight and sluggish metabolism",
        "Hair thinning on the scalp and unwanted facial hair growth"
      ]
    },
    thyroid: {
      title: "Thyroid & Metabolism Support",
      h1: "Online Ayurvedic Hypothyroidism & Metabolism Consultation",
      tagline: "Ignite your cellular metabolism, clear lymphatic congestion, and support thyroid hormone balance naturally under the guidance of Dr. Arti Singh.",
      symptoms: [
        "Unexplained weight gain and persistent puffiness",
        "Severe daily fatigue, sluggishness, and brain fog",
        "Dry, thinning hair and dry skin texture",
        "Increased sensitivity to cold temperatures"
      ]
    },
    ibs: {
      title: "IBS & Gut Health (Bloating)",
      h1: "Online Ayurvedic IBS & Chronic Bloating Consultation",
      tagline: "Rebuild your digestive fire (Agni), eliminate toxins (Ama), and restore balanced intestinal health naturally under the guidance of Dr. Arti Singh.",
      symptoms: [
        "Chronic bloating, gas, and abdominal discomfort",
        "Irregular bowel habits (fluctuating constipation and loose stools)",
        "Acid reflux, indigestion, and heavy feeling after eating",
        "Food intolerances and gut sensitivity"
      ]
    }
  }[disease]

  // 3. Country-specific trust text
  const getTrustBlock = () => {
    switch (country) {
      case "usa":
        return {
          title: "🇺🇸 United States Patient Trust",
          items: [
            "Secure online video consultation over Google Meet",
            "Transparent pricing in USD ($99)",
            "Official digital prescription copy sent via email within 24 hours",
            "International shipping assistance and follow-up support"
          ]
        }
      case "uk":
        return {
          title: "🇬🇧 United Kingdom Patient Trust",
          items: [
            "Direct online video consultations (avoid long NHS specialist waits)",
            "Transparent consultation pricing in GBP (£79)",
            "Digital prescription copy provided directly",
            "Worldwide courier delivery assistance and follow-up support"
          ]
        }
      case "canada":
        return {
          title: "🇨🇦 Canada Patient Trust",
          items: [
            "Secure virtual consultation over Google Meet",
            "Transparent pricing in USD ($99)",
            "Personalized treatment plan sent within 24 hours",
            "Medicine shipping guidelines and tracking support"
          ]
        }
      case "uae":
        return {
          title: "🇦🇪 UAE & Middle East Patient Trust",
          items: [
            "Direct consultation with an authentic B.A.M.S. doctor from India",
            "Transparent pricing in AED (249 AED)",
            "Time-zone friendly appointments",
            "Courier delivery assistance directly to your door in Dubai, Abu Dhabi, or Sharjah"
          ]
        }
      case "australia":
        return {
          title: "🇦🇺 Australia Patient Trust",
          items: [
            "Flexible, time-zone friendly consultation slots",
            "Transparent pricing in USD ($99)",
            "Digital treatment plan & herbs list sent via email",
            "Tracked international shipping and direct WhatsApp follow-up support"
          ]
        }
      default:
        return {
          title: "🌐 International Consultation Trust",
          items: [
            "Secure online video call from any location worldwide",
            "Transparent localized pricing options",
            "Custom digital treatment plans sent within 24 hours",
            "Tracked international delivery and dedicated support"
          ]
        }
    }
  }

  const trustBlock = getTrustBlock()

  // 4. Testimonials (using honest "Online Patient" tags as requested)
  const testimonials = [
    { name: "Online Patient (PCOS)", text: "After years of birth control pills that only masked my symptoms, Dr. Arti helped me regulate my cycle naturally in 4 months. The dietary changes were simple and highly effective." },
    { name: "Online Patient (Thyroid)", text: "My energy levels have completely changed. I no longer feel sluggish in the mornings, and my TSH levels have improved significantly." },
    { name: "Online Patient (IBS)", text: "The bloating and pain after eating are gone. Rebuilding my digestion instead of taking laxatives was the best decision I ever made." }
  ]

  const faqs = [
    { q: "Can I consult from outside India?", a: "Yes, Dr. Arti Singh conducts video consultations for international patients worldwide. All sessions are done via a secure Google Meet video link." },
    { q: "How does the online consultation work?", a: "Once you submit the intake form and complete the payment, you will receive a booking link to choose a convenient time slot. During the video call, Dr. Arti will analyze your symptoms and medical history in detail." },
    { q: "How do I receive my treatment plan?", a: "Within 24 hours of your consultation, a personalized treatment plan—including herbal prescriptions, dietary guidelines, and lifestyle changes—will be emailed to you." },
    { q: "How do follow-up consultations work?", a: "Follow-up slots can be booked when you need to review your progress, typically every 3 to 4 weeks, with dedicated direct support in between." },
    { q: "What if I don't have previous medical reports?", a: "You do not need to prepare anything special. Even if you do not have previous blood tests or reports, we can still begin the consultation by analyzing your history and symptoms." },
    { q: "How do follow-up consultations work?", a: "Follow-up consultations can be booked when you need to review your progress, typically every 3 to 4 weeks, with support from our care team." }
  ]

  const checkoutUrl = `/contact`

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-green-950 to-emerald-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.08),transparent_50%)]" />
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-green-800 text-green-200 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Factual, Root-Cause Holistic Care
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-serif mb-4 leading-tight">
            {diseaseInfo.h1}
          </h1>
          {country && (
            <p className="text-amber-300 font-bold text-sm md:text-base uppercase tracking-wider mb-6">
              Tailored for patients in {country.toUpperCase()}
            </p>
          )}
          <p className="text-base md:text-lg text-green-100 max-w-2xl mx-auto leading-relaxed mb-8">
            {diseaseInfo.tagline}
          </p>
          <Button size="lg" className="bg-white hover:bg-gray-100 text-green-950 font-bold rounded-full px-8 shadow-lg" asChild>
            <Link href={checkoutUrl}>
              <Calendar className="w-4 h-4 mr-2" /> Book Consultation
            </Link>
          </Button>
        </div>
      </section>

      {/* Trust Header Banner */}
      <div className="container mx-auto px-4 max-w-4xl mt-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-xs text-gray-600 leading-relaxed shadow-xs flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <strong>Medically Reviewed:</strong> Managed by <Link href="/doctor/dr-arti-singh" className="underline font-bold">Dr. Arti Singh (B.A.M.S.)</Link> | Last Updated: July 2026
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <section className="container mx-auto px-4 max-w-4xl mt-12 grid md:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-10">
          {/* Symptoms Checklist */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-serif">Common Symptoms We Manage</h2>
            <ul className="space-y-3 text-xs text-gray-600">
              {diseaseInfo.symptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Why Consult Dr. Arti from India? (CEO Objection Handling) */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-serif">Why consult Dr. Arti from India?</h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              International patients seek Indian Ayurvedic care directly due to high local diagnostic costs and the lack of customized natural treatments in Western systems:
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Online consultations available internationally</h4>
                  <p className="text-xxs text-gray-500 mt-0.5">Consult securely from your home via high-definition video calls mapped to your timezone.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Personalized treatment approach</h4>
                  <p className="text-xxs text-gray-500 mt-0.5">Every treatment plan is built specifically for your body’s constitution and history.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Individual consultation time</h4>
                  <p className="text-xxs text-gray-500 mt-0.5">We spend 45 to 60 minutes discussing your health concerns rather than rushing through details.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Transparent consultation pricing</h4>
                  <p className="text-xxs text-gray-500 mt-0.5">Fixed consultation fees without hidden additions or recurring insurance deductibles.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Ongoing follow-up support</h4>
                  <p className="text-xxs text-gray-500 mt-0.5">Direct care support lines to help you implement lifestyle changes and monitor progress.</p>
                </div>
              </div>
            </div>
          </div>

          {/* The Simplified Consultation Journey */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-serif">How Online Consultation Works</h2>
            <div className="relative pl-6 border-l-2 border-green-100 space-y-8 text-xs">
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-green-700 border-4 border-white" />
                <h4 className="font-bold text-gray-900">1. Complete the Consultation Form</h4>
                <p className="text-xxs text-gray-500 mt-1">Submit your basic information and detail your primary symptoms or health concerns.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-green-700 border-4 border-white" />
                <h4 className="font-bold text-gray-900">2. Choose Appointment Time</h4>
                <p className="text-xxs text-gray-500 mt-1">Select a convenient date and time slot from Dr. Arti’s virtual scheduling calendar.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-green-700 border-4 border-white" />
                <h4 className="font-bold text-gray-900">3. Video Consultation</h4>
                <p className="text-xxs text-gray-500 mt-1">Connect over a secure video link for a detailed 45–60 minute health evaluation.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-green-700 border-4 border-white" />
                <h4 className="font-bold text-gray-900">4. Personalized Treatment Plan</h4>
                <p className="text-xxs text-gray-500 mt-1">Receive your official digital treatment protocol outlining natural herbs and guidelines within 24 hours.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-green-700 border-4 border-white" />
                <h4 className="font-bold text-gray-900">5. Medicine & Lifestyle Guidance</h4>
                <p className="text-xxs text-gray-500 mt-1">Get detailed assistance on how to source your classical herbs and implement custom dietary modifications.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-green-700 border-4 border-white" />
                <h4 className="font-bold text-gray-900">6. Follow-up Support</h4>
                <p className="text-xxs text-gray-500 mt-1">Stay connected to monitor your progress and make updates to your regimen as you heal.</p>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-serif">Patient Experiences</h2>
            <div className="space-y-6">
              {testimonials.map((rev, idx) => (
                <div key={idx} className="border-b border-gray-150 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-1 mb-2 text-yellow-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-500" />)}
                  </div>
                  <p className="text-xs text-gray-650 italic mb-2 leading-relaxed">"{rev.text}"</p>
                  <span className="text-xs font-bold text-gray-800">— {rev.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs">
            <h3 className="text-xl font-bold text-gray-900 mb-6 font-serif">Frequently Asked Questions</h3>
            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <h4 className="font-bold text-gray-900 text-sm mb-2">Q. {faq.q}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info Card */}
        <aside className="space-y-6">
          <div className="bg-white rounded-3xl border border-green-100 p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-900 text-sm mb-4 font-serif">Consultation Details</h3>
            <div className="space-y-4 text-xs text-gray-650">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-700 shrink-0" />
                <span>45–60 Minute Video Call</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-700 shrink-0" />
                <span>B.A.M.S. Qualified Doctor</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-700 shrink-0" />
                <span>Custom Diet & Prescriptions</span>
              </div>

              {/* Localized Factual Trust Box */}
              <div className="border-t border-b border-gray-100 py-4 my-2">
                <h4 className="font-bold text-gray-900 text-[11px] mb-2">{trustBlock.title}</h4>
                <ul className="space-y-1.5 text-[10px] text-gray-500 list-disc pl-3">
                  {trustBlock.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Consultation Price</span>
                <div className="text-xl font-bold text-green-950">{pricing?.label || "$99 USD"}</div>
              </div>
              <Button className="w-full bg-green-750 hover:bg-green-800 text-white font-bold rounded-xl mt-4" asChild>
                <Link href={checkoutUrl}>Book Consultation</Link>
              </Button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
