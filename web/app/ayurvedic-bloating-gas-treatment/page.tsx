import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Calendar, CheckCircle2, Star, Clock, FileText, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Ayurvedic Treatment for Bloating & Gas Relief | Ayureva",
  description: "Consult with Dr. Arti Singh (B.A.M.S.) for natural Ayurvedic bloating and gas pain treatment. Rebuild gut health and Agni (digestive fire) naturally.",
  alternates: {
    canonical: "/ayurvedic-bloating-gas-treatment",
  },
}

export default function BloatingTreatmentPage() {
  const faqs = [
    {
      q: "What is the primary cause of chronic bloating in Ayurveda?",
      a: "In Ayurveda, chronic bloating (Adhmana) is primarily caused by an imbalance in Vata Dosha (specifically Samana Vata) and weak Agni (digestive fire). When digestion is slow, food ferments in the gut, producing Ama (undigested toxins) and gas. Treatment focuses on strengthening Agni and regulating Vata flow."
    },
    {
      q: "Which Ayurvedic herbs are most effective for gas relief?",
      a: "Carminative and digestive herbs like Hing (Asafoetida), Ajwain (Carom seeds), Jeera (Cumin), and Pippali (Long pepper) are highly effective. For chronic cases, classical formulations such as Hinguvastak Churna, Shankha Vati, or Lasunadi Vati are prescribed based on your specific constitution."
    },
    {
      q: "How long does it take to see results with Ayurvedic bloating treatment?",
      a: "Acute gas relief can happen within 24-48 hours of using kitchen spices and correct eating habits. For chronic bloating, flatulence, or IBS-related symptoms, it typically takes 4-6 weeks of structured herbal treatment and dietary modification to restore complete gut balance."
    }
  ]

  const reviews = [
    { name: "Meera S. (Mumbai)", text: "I struggled with severe bloating after every meal for over 2 years. I felt like I was 6 months pregnant. Within 3 weeks of Dr. Arti's personalized diet and herbal powders, my stomach feels completely light and normal again.", rating: 5 },
    { name: "Ananya K. (London)", text: "Excellent online consultation. Dr. Arti explained how my cold salads were aggravating my Vata. Switched to warm spiced foods and took the prescribed formulations. Huge difference in my digestion and energy!", rating: 5 }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-green-950 to-emerald-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.08),transparent_50%)]" />
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-green-800 text-green-200 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Medically Managed Gut Health
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 leading-tight">
            Ayurvedic Treatment for Chronic Gas & Bloating Relief
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto leading-relaxed mb-8">
            Rebuild your Agni (digestive fire), clear toxic buildup (Ama), and deflate bloating naturally under the guidance of Dr. Arti Singh.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">The Root Cause: Aggravated Vata & Slow Agni</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Modern medicine often treats bloating with antacids or artificial enzymes. Ayurveda digs deeper: gas is a symptom of accumulated <strong>Ama</strong> (metabolic toxins) trapped by un-channeled <strong>Vata Dosha</strong> in the gut.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our clinical protocol targets the root causes: we ignite your digestive fire so food breaks down fully, prevent fermentation in the stomach channels, and use carminative herbs to soothe abdominal cramping and flatulence.
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
                    <span className="text-green-600 mt-0.5">✓</span> Abdominal tightness & swelling after eating
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span> Persistent belching or excessive flatulence
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span> Mild digestive cramping and heavy stomach feeling
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-red-800 text-sm mb-2">⚠️ Red Flag Warning Signs</h4>
                <p className="text-xs text-gray-500 mb-2">Consult a doctor immediately if bloating is accompanied by:</p>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span> Severe, sudden abdominal pain
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span> Blood in stool or dark black stool
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span> Unexplained weight loss or persistent vomiting
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
              <li>Central Council for Research in Ayurvedic Sciences (CCRAS). <em>Digestive Disorders Management Guidelines</em>. Ministry of AYUSH.</li>
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
