import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Video, CheckCircle, ShieldCheck, MapPin, Award, BookOpen, Clock, Heart, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Dr. Arti Singh | B.A.M.S. Ayurvedic Gynecologist & PCOS Specialist",
  description: "Consult with Dr. Arti Singh (B.A.M.S.), licensed Ayurvedic physician specializing in PCOS, infertility, and women's hormonal health. Patna Clinic & Online Consultation.",
  alternates: {
    canonical: "/doctor/dr-arti-singh",
  },
}

export default function DoctorProfilePage() {
  const faqs = [
    {
      q: "What are Dr. Arti's medical credentials and licensing?",
      a: "Dr. Arti Singh holds a Bachelor of Ayurvedic Medicine and Surgery (B.A.M.S.) from State Government Ayurvedic College, Patna. She is officially registered with the Bihar State Board of Ayurvedic and Unani Medicine Systems (Registration No. 4200)."
    },
    {
      q: "How does the online consultation process work?",
      a: "The process is simple: (1) Book a slot through our online portal. (2) Fill out the health intake form, sharing any recent blood reports or scans. (3) Connect with Dr. Arti via a secure HD video call. (4) Receive a customized digital treatment plan and have lab-tested herbal formulations shipped directly to your address."
    },
    {
      q: "Do you consult international patients in the USA, UK, or Gulf?",
      a: "Yes, a significant part of Dr. Arti's clinical practice consists of treating NRIs and international patients. Consultations are scheduled in local time zones (GMT, EST, PST, etc.), and custom formulations are shipped globally using verified courier partners."
    },
    {
      q: "Does Ayurvedic PCOD care require lifelong treatment?",
      a: "No. Unlike conventional hormonal pills which simply mask symptoms, Ayurvedic treatment is designed to restore natural cellular metabolism and ovulation. Once your hormonal cycle is stabilized and your Agni (metabolism) is normalized (typically 3-6 months), treatments can be safely tapered off while maintaining a healthy lifestyle."
    }
  ]

  const credentials = [
    { icon: <Award className="w-5 h-5 text-green-700" />, label: "B.A.M.S. Degree", desc: "Bachelor of Ayurvedic Medicine & Surgery (Patna Govt. College)" },
    { icon: <ShieldCheck className="w-5 h-5 text-green-700" />, label: "Registered Practitioner", desc: "Reg No. 4200 (Bihar Board of Ayurvedic Systems)" },
    { icon: <MapPin className="w-5 h-5 text-green-700" />, label: "Patna Clinic", desc: "Bahadurpur Gumati, Rajendra Nagar, Patna, Bihar 800016" },
    { icon: <Heart className="w-5 h-5 text-green-700" />, label: "Specialization", desc: "Prasuti Tantra (Ayurvedic Gynaecology) & Stri Roga (Women's Health)" }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Bio banner */}
      <section className="bg-gradient-to-b from-green-950 to-emerald-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.08),transparent_50%)]" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Profile Picture */}
            <div className="w-48 h-48 relative rounded-full overflow-hidden border-4 border-white shadow-2xl flex-shrink-0">
              <Image 
                src="/dr-arti-singh.jpg" 
                alt="Dr. Arti Singh" 
                fill 
                className="object-cover" 
                priority
              />
            </div>
            
            {/* Quick Details */}
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-green-800/80 border border-green-700 text-green-200 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                <ShieldCheck className="w-4 h-4" /> Medically Verified Practitioner
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-serif mb-2">Dr. Arti Singh</h1>
              <p className="text-green-300 text-lg font-medium mb-4">B.A.M.S. (Ayurvedacharya) • Women's Hormonal Health Specialist</p>
              
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                <Button size="lg" className="bg-white hover:bg-gray-100 text-green-950 font-bold rounded-full shadow-lg" asChild>
                  <Link href="/contact">
                    <Calendar className="w-4 h-4 mr-2" /> Book Private Consultation
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Info Grid */}
      <section className="container mx-auto px-4 max-w-5xl mt-12">
        <div className="grid md:grid-cols-[1fr_320px] gap-8">
          
          {/* Bio details */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-xs border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">Clinical Philosophy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                "PCOS, thyroid disorders, and heavy period bleeding are not diseases that can be cured by masking symptoms with synthetic birth control pills. My treatment philosophy is centered on correcting <strong>Agni</strong> (metabolic fire) and purifying <strong>Artava</strong> (ovarian channels) to let the body heal itself naturally."
              </p>
              <p className="text-gray-700 leading-relaxed">
                Over the past 8+ years, Dr. Arti Singh has helped thousands of women worldwide achieve sustainable hormonal balance, reverse ovarian cysts, and improve egg quality for healthy conception using evidence-based Ayurvedic formulations, customized local nutrition, and structured lifestyle guidance.
              </p>
            </div>

            {/* Medical Credentials */}
            <div className="bg-white rounded-3xl p-8 shadow-xs border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Professional Credentials</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {credentials.map((cred, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                      {cred.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{cred.label}</h4>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{cred.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consultation Process */}
            <div className="bg-white rounded-3xl p-8 shadow-xs border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Our Consultation Methodology</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="font-serif font-bold text-xl text-green-700">01</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Detailed Prakriti (Constitution) Analysis</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">We evaluate your dominant bodily Doshas (Vata, Pitta, Kapha) and current imbalances (Vikriti) to isolate the root drivers of your condition.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="font-serif font-bold text-xl text-green-700">02</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Tailored Herbal Therapeutics</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">You receive a customized prescription detailing classical laboratory-tested herbs (such as Kanchanar Guggulu, Shatavari, or Lodhra) compounded for your body's tolerance.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="font-serif font-bold text-xl text-green-700">03</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Climate & Region-Adapted Diet Plans</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">Nutrition rules are adjusted to match your local climate and grocery availability (e.g. warming diet guidelines for UK/US weather, native millets for Indian regions).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-3xl p-8 shadow-xs border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif text-center">Frequently Asked Questions</h3>
              <div className="space-y-6">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-gray-50 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-start gap-2">
                      <span className="text-green-700">Q.</span> {faq.q}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed pl-4">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar CTA */}
          <aside className="space-y-6">
            <div className="bg-white rounded-3xl border border-green-100 p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-1.5 text-xs text-green-800 bg-green-50 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-4 w-fit">
                <Clock className="w-3.5 h-3.5" /> Book Consultation
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">1-on-1 Private Session</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                Connect directly with Dr. Arti Singh via a secure video call to diagnose your Dosha imbalances and co-create your healing plan.
              </p>

              <ul className="space-y-3 mb-6 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold font-serif text-xxs">✓</span>
                  30-45 Minute Private Session
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold font-serif text-xxs">✓</span>
                  Customized Herbal Medicines
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold font-serif text-xxs">✓</span>
                  Lifetime Lifestyle Guidance
                </li>
              </ul>

              <Button className="w-full bg-green-700 hover:bg-green-800 text-white font-bold h-12 shadow-md rounded-xl" asChild>
                <Link href="/contact">Check Appointment Slots</Link>
              </Button>
            </div>
          </aside>

        </div>
      </section>
    </div>
  )
}
