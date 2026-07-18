import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Calendar, CheckCircle2, Star, Clock, FileText, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Ayurvedic Treatment for Endometriosis & Chocolate Cysts | Ayureva",
  description: "Consult with Dr. Arti Singh (B.A.M.S.) for natural Ayurvedic endometriosis care. Manage pelvic pain and chocolate cysts naturally without surgery.",
  alternates: {
    canonical: "/ayurvedic-endometriosis-treatment",
  },
}

export default function EndometriosisTreatmentPage() {
  const faqs = [
    {
      q: "Can Ayurveda help dissolve chocolate cysts naturally?",
      a: "Yes. In Ayurveda, chocolate cysts are classified as Granthi (pelvic growths) caused by localized Kapha accumulation and blocked Vata flow. We utilize specific 'Lekhana' (scraping) herbs like Kanchanar Guggulu, combined with pelvic circulation enhancers like Varunadi Kashayam, to gradually shrink and dissolve the cystic capsule naturally."
    },
    {
      q: "How does Ayurveda manage chronic endometriosis pelvic pain?",
      a: "The excruciating pain of endometriosis is primarily a Vata Dosha pathology (specifically Apana Vata, which governs pelvic downwards movement). By using internal oiling (Snehana), mild laxative therapies (Virechana) to clear pelvic congestion, and specific anti-inflammatory herbs like Haridra (Turmeric) and Shunthi (Ginger), we reduce local swelling and calm nerve irritation."
    },
    {
      q: "Is surgery always necessary for endometriosis?",
      a: "While large cysts (greater than 6-8cm) causing immediate acute emergencies may require surgical evaluation, mild to moderate endometriosis and smaller chocolate cysts can often be managed conservatively. Ayurveda aims to arrest the progression of ectopic tissue and relieve pelvic adhesions, allowing many women to live symptom-free without surgery."
    }
  ]

  const reviews = [
    { name: "Kiran J. (Delhi)", text: "I had a 4cm chocolate cyst on my left ovary and was scheduled for surgery. I decided to try Ayurveda first. Dr. Arti prescribed a strict anti-inflammatory diet and specific herbal formulations. A follow-up ultrasound after 4 months showed the cyst had completely dissolved! No surgery needed.", rating: 5 },
    { name: "Richa S. (Sharjah)", text: "The pelvic pain during periods was unbearable. After consulting Dr. Arti online and starting the treatment, my pain went down from a 9/10 to a 2/10 in just 3 cycles. I am very grateful for her guidance.", rating: 5 }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-green-950 to-emerald-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.08),transparent_50%)]" />
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-green-800 text-green-200 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Medically Managed Pelvic Health
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 leading-tight">
            Ayurvedic Care for Endometriosis & Chocolate Cysts
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto leading-relaxed mb-8">
            Clear pelvic blockages, reduce inflammatory pain, and restore healthy ovarian tissues naturally under the guidance of Dr. Arti Singh.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">The Root Cause: Vata-Kapha Blockages (Granthi)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Ayurveda treats endometriosis as an imbalance of <strong>Apana Vata</strong> (the downward moving force) leading to retrograde menstruation, coupled with <strong>Kapha</strong> buildup that causes ectopic uterine tissue to adhere to surrounding pelvic organs, forming cysts (Granthi).
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our clinical protocol is designed to cleanse and clear these blockages: we utilize traditional scraping (Lekhana) herbs to dissolve cyst tissues, improve lymphatic drainage in the pelvis, and calm Apana Vata to resolve menstrual pain at its source.
            </p>
          </div>

          {/* Pricing & Transparency */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Transparent Care Options</h2>
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
