import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Calendar, CheckCircle2, Star, Clock, FileText, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Ayurvedic Thyroid (Hypothyroidism) Treatment | Ayureva",
  description: "Consult with Dr. Arti Singh (B.A.M.S.) for natural Ayurvedic thyroid and hypothyroidism treatment. Clear glandular blockages and ignite metabolism.",
  alternates: {
    canonical: "/ayurvedic-thyroid-treatment",
  },
}

export default function ThyroidTreatmentPage() {
  const faqs = [
    {
      q: "Can Hypothyroidism be reversed with Ayurveda, or do I need pills forever?",
      a: "Yes, early and subclinical hypothyroidism can often be reversed by stimulating your body's natural thyroid gland function. Instead of just replacing thyroid hormone (which causes the gland to become even lazier), Ayurveda focuses on restoring cell-level metabolic fire (Dhatu Agni) and clearing lymphatic congestion. Chronic cases can also use Ayurveda to reduce thyroid dosage and manage symptoms like weight gain and fatigue."
    },
    {
      q: "Which herbs are best for thyroid health?",
      a: "Kanchanar Guggulu is the premier classical formulation for thyroid nodular swellings and hypothyroidism. Guggulu stimulates thyroid iodine uptake, Varuna clears lymphatic channels, and Ashwagandha balances cortisol (stress hormone) which directly improves T4 to T3 conversion."
    },
    {
      q: "What dietary changes are required during thyroid treatment?",
      a: "Avoid raw goitrogenic foods (such as raw cabbage, broccoli, cauliflower) as they interfere with iodine absorption. Shift to warm, easily digestible meals. Limit heavy, cold dairy, and reduce refined white sugars that aggravate Kapha and slow down metabolic pathways."
    }
  ]

  const reviews = [
    { name: "Divya N. (Chennai)", text: "My TSH was 9.4 and I had severe hair fall and joint pain. After starting Dr. Arti's Kanchanar Guggulu protocol and cutting out curd and cold food, my TSH came down to 3.8 in just 3 months! My energy levels have doubled.", rating: 5 },
    { name: "Rohini P. (Dubai)", text: "Highly recommend Dr. Arti for thyroid management. She explained how stress and gut toxins were slowing my thyroid. The prescription and lifestyle plan are very practical and highly effective.", rating: 5 }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-green-950 to-emerald-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.08),transparent_50%)]" />
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-green-800 text-green-200 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Glandular & Metabolic Restoration
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 leading-tight">
            Ayurvedic Treatment for Hypothyroidism & Sluggish Thyroid
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto leading-relaxed mb-8">
            Ignite your Dhatu-Agni (cellular metabolism), clear neck glandular blockages, and balance T3/T4/TSH levels naturally under the guidance of Dr. Arti Singh.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">The Root Cause: Galaganda & Dhatu Agnimandya</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Thyroid imbalances are classified under **Galaganda** (cervical swellings) and **Dhatu Agnimandya** (low cellular metabolic fire). The thyroid gland regulates metabolic speed. When sluggish **Kapha** and fat tissue (**Meda**) block throat channels, hormone circulation drops.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our clinical protocol stimulates thyroid function by using warming (*Ushna*) herbs to dissolve neck channel blockages, scraping formulations like Kanchanar Guggulu to detoxify glandular tissues, and regulating digestion (*Jatharagni*) to normalize systemic thyroid conversions.
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
                    <span className="text-green-600 mt-0.5">✓</span> Unexplained weight gain and severe facial swelling
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span> Severe dry skin, dry thinning hair, and hair fall
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span> Brain fog, fatigue, muscle weakness, and cold sensitivity
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-red-800 text-sm mb-2">⚠️ Red Flag Warning Signs</h4>
                <p className="text-xs text-gray-500 mb-2">Consult a doctor immediately if thyroid symptoms are accompanied by:</p>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span> Severe swelling in the neck causing breathing/swallowing issues
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span> Extreme hoarseness of voice or difficulty speaking
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span> Extremely slow heart rate or severe mental confusion
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
                <div className="text-2xl font-bold text-green-950 mb-4">₹999 <span className="text-xs font-normal text-gray-500">/ session</span></div>
                <Button className="w-full bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl" asChild>
                  <Link href="/contact">Book Domestic</Link>
                </Button>
              </div>
              <div className="border border-green-100 rounded-2xl p-6 bg-green-50/30">
                <h4 className="font-bold text-gray-900 text-sm mb-1">International Consultation</h4>
                <p className="text-xs text-gray-500 mb-4">For patients residing in US, UK, Canada, UAE</p>
                <div className="text-2xl font-bold text-green-950 mb-4">$49 USD <span className="text-xs font-normal text-gray-500">/ session</span></div>
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
              <li>Sushruta. (2018). <em>Sushruta Samhita</em>. (T. Acharya, Ed.). Varanasi: Chaukhambha Orientalia.</li>
              <li>Central Council for Research in Ayurvedic Sciences (CCRAS). <em>Hypothyroidism Glandular Treatment Protocols</em>. Ministry of AYUSH.</li>
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
                <div className="text-xl font-bold text-green-950">₹999 / $49 USD</div>
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
