import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Calendar, CheckCircle2, Star, Clock, FileText, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Ayurvedic Leucorrhea & White Discharge Treatment | Ayureva",
  description: "Consult with Dr. Arti Singh (B.A.M.S.) for natural Ayurvedic leucorrhea and chronic white discharge treatment. Balance Kapha Dosha and clear pelvic toxins.",
  alternates: {
    canonical: "/ayurvedic-white-discharge-treatment",
  },
}

export default function WhiteDischargeTreatmentPage() {
  const faqs = [
    {
      q: "Is white discharge normal, or do I need medical treatment?",
      a: "A thin, odorless, and clear discharge is normal during ovulation or pre-menstrual phases. However, if the discharge is thick, milky white, yellow, clumped (like cottage cheese), accompanied by bad odor, vaginal itching, or burning sensation, it is pathological and referred to as Leucorrhea (Shveta Pradara) in Ayurveda. This requires clinical treatment to restore vaginal pH and clear local tissue congestion."
    },
    {
      q: "How does Ayurveda treat chronic vaginal infections and discharge?",
      a: "We address leucorrhea by targeting Kapha aggravation and pelvic toxins (Ama). Treatment includes internal cooling and astringent herbs like Lodhra, Ashoka, Udumbara, and Pradarantak Churna. We also advise on pelvic hygiene guidelines and specific Kapha-reducing diets (avoiding excessive sweets, curd, and heavy dairy)."
    },
    {
      q: "Can this treatment help with recurrent yeast infections or bacterial vaginosis (BV)?",
      a: "Yes. Ayurvedic herbs contain natural antimicrobial, anti-inflammatory, and antifungal properties. Instead of just temporarily killing bacteria (which often leads to recurrence), our protocol strengthens the local mucous membranes (Yoni Srotas) and builds pelvic immunity to prevent future infections."
    }
  ]

  const reviews = [
    { name: "Suman K. (Hyderabad)", text: "I suffered from recurrent vaginal itching and thick white discharge for over a year. Antibiotics gave only temporary relief. Dr. Arti's astringent herbal decoction and diet changes cured my symptoms in just 3 weeks. It's been 6 months and I have had zero recurrence!", rating: 5 },
    { name: "Pooja D. (Kolkata)", text: "Very professional and understanding doctor. Dr. Arti explained how Kapha dampness was affecting my pelvic health. The prescribed medicines and hygiene tips worked wonders. The foul odor and burning are completely gone.", rating: 5 }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-green-950 to-emerald-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.08),transparent_50%)]" />
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-green-800 text-green-200 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Pelvic & Vaginal Flora Restoration
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 leading-tight">
            Ayurvedic Treatment for Chronic White Discharge (Leucorrhea)
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto leading-relaxed mb-8">
            Clear Kapha-dampness, soothe vaginal itching, and rebuild healthy pelvic microflora naturally under the guidance of Dr. Arti Singh.
          </p>
          <Button size="lg" className="bg-white hover:bg-gray-100 text-green-950 font-bold rounded-full px-8 shadow-lg" asChild>
            <Link href="/contact">
              <Calendar className="w-4 h-4 mr-2" /> Book Online Consultation
            </Link>
          </Button>
        </div>
      </section>

      {/* Trust Header Banner */}
      <div className="container mx-auto px-4 max-w-4xl mt-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-xs text-gray-600 leading-relaxed shadow-xs flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <strong>Medically Reviewed & Managed:</strong> Reviewed by <Link href="/doctor/dr-arti-singh" className="underline font-bold">Dr. Arti Singh (B.A.M.S.)</Link> | Last Updated: July 2026 | Next Review Date: July 2027
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <section className="container mx-auto px-4 max-w-4xl mt-12 grid md:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-10">
          {/* Clinical Perspective */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">The Root Cause: Kapha Dampness & Kleda</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In Ayurvedic texts, pathological white discharge is called **Shveta Pradara**. It is primarily a **Kapha-dominated** disorder. When Kapha Dosha increases due to improper diet, excessive fermentation in the gut, or lifestyle triggers, it creates **Kleda** (excess dampness/moisture) in the reproductive channels (*Artava Vaha Srotas*).
            </p>
            <p className="text-gray-700 leading-relaxed">
              This damp environment allows pathogens to thrive, resulting in discharge, odor, and irritation. Our clinical protocol focuses on dry, astringent (*Kashaya*), and toxin-clearing (*Vishaghna*) herbs to absorb excess moisture, restore local tissue integrity, and balance the vaginal microbiome.
            </p>
          </div>

          {/* Symptoms & Red Flags */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">Symptoms & When to Seek Medical Care</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-2 text-green-800">Common Symptoms We Manage</h4>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span> Thick, sticky, or curd-like white/yellow discharge
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span> Vaginal itching, soreness, or burning during urination
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span> Dull lower backache or pelvic heaviness
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-red-800 text-sm mb-2">⚠️ Red Flag Warning Signs</h4>
                <p className="text-xs text-gray-500 mb-2">Consult a doctor immediately if discharge is accompanied by:</p>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span> Foul-smelling greenish, greyish, or frothy discharge
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span> Unusual spotting or bleeding between menstrual cycles
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span> High fever, chills, or severe lower abdominal pain
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pricing & Transparency */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">Transparent Care Options</h2>
            <p className="text-xs text-gray-500 mb-6">Every online consultation with Dr. Arti Singh includes:</p>
            <ul className="grid sm:grid-cols-2 gap-3 text-xs text-gray-600 mb-8 bg-green-50/20 border border-green-50 rounded-2xl p-6">
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span> 30-45 Minute Secure Video Call
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span> Complete Case History & Dosha Analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span> Customized Herbal Medicine Formulation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span> Personalized Region-Specific Diet & Lifestyle Plan
              </li>
            </ul>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-green-100 rounded-2xl p-6 bg-green-50/30">
                <h4 className="font-bold text-gray-900 text-sm mb-1">Domestic Consultation</h4>
                <p className="text-xs text-gray-500 mb-4">For patients residing within India</p>
                <div className="text-2xl font-bold text-green-950 mb-4">₹500 <span className="text-xs font-normal text-gray-500">/ session</span></div>
                <Button className="w-full bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl" asChild>
                  <Link href="/contact">Book Domestic</Link>
                </Button>
              </div>
              <div className="border border-green-100 rounded-2xl p-6 bg-green-50/30">
                <h4 className="font-bold text-gray-900 text-sm mb-1">International Consultation</h4>
                <p className="text-xs text-gray-500 mb-4">For patients residing in US, UK, Canada, UAE</p>
                <div className="text-2xl font-bold text-green-950 mb-4">$99 USD <span className="text-xs font-normal text-gray-500">/ session</span></div>
                <Button className="w-full bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl" asChild>
                  <Link href="/contact">Book International</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Reviews & Testimonials */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Patient Success Stories</h2>
            <div className="space-y-6">
              {reviews.map((rev, idx) => (
                <div key={idx} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-1 mb-2 text-yellow-500">
                    {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-500" />)}
                  </div>
                  <p className="text-xs text-gray-600 italic mb-2 leading-relaxed">"{rev.text}"</p>
                  <span className="text-xs font-bold text-gray-800">— {rev.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Frequently Asked Questions</h3>
            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-gray-50 pb-4 last:border-b-0 last:pb-0">
                  <h4 className="font-bold text-gray-900 text-sm mb-2">Q. {faq.q}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Medical References */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs text-xxs text-gray-500">
            <h4 className="font-bold text-gray-700 text-xs mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Medical Editorial References
            </h4>
            <ol className="list-decimal pl-4 space-y-1">
              <li>World Health Organization (WHO). (2019). <em>WHO Benchmarks for Training in Ayurveda</em>. Geneva.</li>
              <li>Agnivesha. (2018). <em>Charaka Samhita</em>. (T. Acharya, Ed.). Varanasi: Chaukhambha Sanskrit Sansthan.</li>
              <li>Central Council for Research in Ayurvedic Sciences (CCRAS). <em>Leucorrhea (Shveta Pradara) Standard Treatment Protocols</em>. Ministry of AYUSH.</li>
            </ol>
          </div>
        </div>

        {/* Sidebar Info card */}
        <aside className="space-y-6">
          <div className="bg-white rounded-3xl border border-green-100 p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-900 text-base mb-4 font-serif">Consultation Details</h3>
            <div className="space-y-4 text-xs text-gray-650">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-700 shrink-0" />
                <span>30–45 Minute Video Call</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-700 shrink-0" />
                <span>Registered B.A.M.S. Doctor</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-700 shrink-0" />
                <span>Custom Diet & Prescriptions</span>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-4">
                <span className="text-2xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Clinic Pricing</span>
                <div className="text-xl font-bold text-green-950">₹500 / $99 USD</div>
              </div>
              <Button className="w-full bg-green-750 hover:bg-green-800 text-white font-bold rounded-xl mt-4" asChild>
                <Link href="/contact">Book Consultation</Link>
              </Button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
