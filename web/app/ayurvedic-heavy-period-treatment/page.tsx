import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Calendar, CheckCircle2, Star, Clock, FileText, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Ayurvedic Treatment for Heavy Period Bleeding (Menorrhagia) | Ayureva",
  description: "Consult with Dr. Arti Singh (B.A.M.S.) for natural Ayurvedic heavy period bleeding care. Stop menorrhagia naturally using traditional cooling herbs.",
  alternates: {
    canonical: "/ayurvedic-heavy-period-treatment",
  },
}

export default function HeavyPeriodsTreatmentPage() {
  const faqs = [
    {
      q: "What causes excessive menstrual bleeding in Ayurveda?",
      a: "In Ayurveda, heavy menstrual bleeding (known as Raktapradar or Asrigdara) is primarily a Pitta Dosha disorder. Aggravated Pitta enters the blood (Rakta Dhatu), causing blood vessels to dilate and flow too freely. Secondary Vata imbalance can also disrupt normal uterine muscle contraction."
    },
    {
      q: "Which cooling herbs are used to manage heavy flow?",
      a: "Traditional Ayurvedic medicine utilizes 'Stambhana' (hemostatic) and Pitta-shamaka (cooling) herbs. Chief among these is Ashoka bark (Saraca asoca) decoction, Lodhra bark, and Nagkesar. For severe heat symptoms, Praval Pishti (coral calcium) and Kamadudha Rasa are prescribed."
    },
    {
      q: "When should I see a doctor immediately for heavy bleeding?",
      a: "If you are soaking through more than one pad an hour, passing large blood clots (larger than a coin), feeling lightheaded, dizzy, or severely fatigued, these are signs of acute anemia and require immediate medical evaluation."
    }
  ]

  const reviews = [
    { name: "Pooja M. (Delhi)", text: "I was suffering from 10-day long heavy periods that left me completely weak and anemic. Dr. Arti's herbal decoctions and simple dietary changes to cool down my body heat cut down my flow duration to 5 normal days in just 2 cycles. Life-changing!", rating: 5 },
    { name: "Suman R. (Bangalore)", text: "Very professional online clinic. The prescription details were clear, and the custom herbs were shipped to my home. Highly recommend Dr. Arti for women's hormonal issues.", rating: 5 }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-green-950 to-emerald-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.08),transparent_50%)]" />
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-green-800 text-green-200 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Medically Managed Hormonal Care
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 leading-tight">
            Ayurvedic Management of Heavy Period Bleeding (Raktapradar)
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto leading-relaxed mb-8">
            Soothe excess body heat (Pitta), tone your uterine walls, and restore a normal, healthy cycle naturally under the guidance of Dr. Arti Singh.
          </p>
          <Button size="lg" className="bg-white hover:bg-gray-100 text-green-950 font-bold rounded-full px-8 shadow-lg" asChild>
            <Link href="/contact">
              <Calendar className="w-4 h-4 mr-2" /> Book Online Consultation
            </Link>
          </Button>
        </div>
      </section>

      {/* Trust & EEAT Header Banner */}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">The Root Cause: Excess Pitta in the Blood</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Conventional treatments for heavy periods (Menorrhagia) often involve prescription hormones or invasive procedures. Ayurveda offers a cooling, restorative approach.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We look at heavy periods as a manifestation of <strong>Raktapradar</strong>—where excessive heat in the circulatory channels dilutes the blood. By cooling the blood, strengthening the uterine lining with classical uterine tonics, and stabilizing thyroid-pituitary communication, we help guide you back to a balanced, comfortable cycle.
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
                    <span className="text-green-600 mt-0.5">✓</span> Soaking through one or more pads/tampons per hour
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span> Passing blood clots larger than a quarter
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span> Menstrual bleeding lasting longer than 7 consecutive days
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-red-800 text-sm mb-2">⚠️ Red Flag Warning Signs</h4>
                <p className="text-xs text-gray-500 mb-2">Consult a doctor immediately if bleeding is accompanied by:</p>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span> Severe dizziness, fainting, or extreme fatigue
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span> Sudden, sharp pelvic pain
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span> Bleeding during pregnancy or post-menopause
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
              <li>Agnivesha. (2018). <em>Charaka Samhita</em>. (T. Acharya, Ed.). Varanasi: Chaukhambha Sanskrit Sansthan.</li>
              <li>Sushruta. (2017). <em>Sushruta Samhita</em>. (P. V. Sharma, Trans.). Varanasi: Chaukhambha Visvabharti.</li>
            </ol>
          </div>
        </div>

        {/* Sidebar Info card */}
        <aside className="space-y-6">
          <div className="bg-white rounded-3xl border border-green-100 p-6 shadow-sm sticky top-24">
            <div className="flex items-center gap-1.5 text-xs text-green-800 bg-green-50 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-4 w-fit">
              <Clock className="w-3.5 h-3.5" /> Consultation Info
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 font-serif">Get Private Guidance</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Connect directly with Dr. Arti Singh via HD video call to diagnose your Dosha type and receive your custom treatment plan.
            </p>
            <Button className="w-full bg-green-700 hover:bg-green-800 text-white font-bold h-11 rounded-xl shadow-md" asChild>
              <Link href="/contact">Book Consultation</Link>
            </Button>
          </div>
        </aside>
      </section>
    </div>
  )
}
