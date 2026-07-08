import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Award, FileText, Truck, HelpCircle, CheckCircle, Scale } from "lucide-react"

export const metadata: Metadata = {
  title: "Trust, Editorial & Medical Review Policy | Ayureva by Dr. Arti Singh",
  description:
    "Learn about Ayureva's strict editorial guidelines, medical review standards, Dr. Arti Singh's B.A.M.S. credentials, and international herbal shipping policies.",
  keywords: ["medical trust", "editorial policy", "doctor credentials", "Ayurveda shipping USA", "Ayureva trust guidelines"],
  alternates: {
    canonical: "/trust",
  },
}

export default function TrustHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-20">
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header Banner */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">Trust & Transparency</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Ayureva Trust Hub</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our clinical guidelines, medical review policies, doctor credentials, and international shipping standards.
            </p>
            <p className="text-sm text-gray-500 mt-2">Last updated: January 2026</p>
          </div>

          <div className="space-y-8">
            {/* 1. Doctor Credentials & Registration */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-green-600"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Award className="w-6 h-6 text-green-600" />
                1. Doctor Qualifications & Registrations
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  All consultations and medical content at Ayureva are led and reviewed directly by <strong>Dr. Arti Singh</strong>.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100 text-sm">
                  <div>
                    <span className="font-semibold block text-gray-500">Degree:</span>
                    <span className="font-bold text-gray-800">Bachelor of Ayurvedic Medicine and Surgery (B.A.M.S.)</span>
                  </div>
                  <div>
                    <span className="font-semibold block text-gray-500">Affiliation:</span>
                    <span className="font-bold text-gray-800">Government Ayurvedic College & Hospital, Patna</span>
                  </div>
                  <div>
                    <span className="font-semibold block text-gray-500">Medical Registration Number:</span>
                    <span className="font-bold text-green-700 font-mono">Reg. No: 4200 (State Council of Ayurvedic and Unani Medicine, Bihar)</span>
                  </div>
                  <div>
                    <span className="font-semibold block text-gray-500">Languages Spoken:</span>
                    <span className="font-bold text-gray-800">English, Hindi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Medical Review & Editorial Policy */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-green-600"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FileText className="w-6 h-6 text-green-600" />
                2. Editorial & Medical Review Policy
              </h2>
              <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                <p>
                  At Ayureva, our goal is to deliver accurate, clinically sound, and scientifically cited health information. We adhere to strict editorial standards:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Physician Review:</strong> Every article, guide, and health recommendation is reviewed and approved by a certified BAMS physician to ensure it complies with traditional texts (Samhitas) and modern research.</li>
                  <li><strong>Source Citation:</strong> All medical assertions are backed by peer-reviewed clinical studies (PubMed, NIH, DHARA) and classical Ayurvedic literature. You will find explicit citations at the bottom of our articles.</li>
                  <li><strong>No Unsupported Claims:</strong> We do not claim to "cure" chronic endocrine or lifestyle disorders. We focus on symptom management, root-cause detoxification (Ama Shodhana), metabolic support (Agni Deepana), and healthy remission guidance.</li>
                </ul>
              </div>
            </div>

            {/* 3. International Shipping & Customs Policy */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-green-600"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Truck className="w-6 h-6 text-green-600" />
                3. International Shipping & Delivery Logistics
              </h2>
              <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                <p>
                  We regularly ship customized Ayurvedic formulations, herbal teas, and single herbs to patients worldwide. Below are our regional shipping details:
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                    <h3 className="font-bold text-emerald-950 mb-1 flex items-center gap-1.5">🇺🇸 United States (FDA & Import Policy)</h3>
                    <p className="text-xs text-emerald-900">
                      Herbal supplements are classified as dietary supplements in the USA. We ship via DHL Express/FedEx with compliant labeling. Average transit time is <strong>5-7 business days</strong>. No import licenses are required for personal use orders.
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                    <h3 className="font-bold text-emerald-950 mb-1 flex items-center gap-1.5">🇬🇧 United Kingdom (VAT & Delivery)</h3>
                    <p className="text-xs text-emerald-900">
                      Shipped with fully declared custom codes (HS codes) matching herbal tea or dietary formulations. Transit time is <strong>6-8 business days</strong>. Personal import limits are observed, and VAT is pre-cleared where applicable.
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                    <h3 className="font-bold text-emerald-950 mb-1 flex items-center gap-1.5">🇦🇺 Australia (Biosecurity & Quarantine)</h3>
                    <p className="text-xs text-emerald-900">
                      Australia has strict biosecurity rules. We only ship commercially sealed, professionally labeled dry herb extracts or tablet formulations that meet DAFF import guidelines. Raw plants or unsealed seeds are strictly excluded. Average transit time: <strong>7-10 business days</strong>.
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                    <h3 className="font-bold text-emerald-950 mb-1 flex items-center gap-1.5">🇪🇺 Europe & Gulf Region</h3>
                    <p className="text-xs text-emerald-900">
                      Customs compliance varies. We ship using standard global cargo carriers with standard lab reports attached to facilitate smooth clearance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Consultation & Clinical Policies */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-green-600"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Scale className="w-6 h-6 text-green-600" />
                4. Consultation & Clinical Care Policies
              </h2>
              <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span><strong>1-on-1 Confidentiality:</strong> Your consultations, symptoms, prescriptions, and chats are encrypted and stored in secure HIPAA-compliant storage. We never share patient records with third parties.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span><strong>TimeZone Matching:</strong> We schedule consultations matching your local timezone. When booking through Calendly, your slot is dynamically mapped to your country's local time to avoid any confusion.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span><strong>Medicine Integrity:</strong> All recommended Ayurvedic remedies are procured from GMP-certified (Good Manufacturing Practices) and lab-tested organic pharmacies in India.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 5. Frequently Asked Questions */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-green-600"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-green-600" />
                5. Common Telehealth Questions
              </h2>
              
              <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="font-bold text-gray-900 mb-2">How do I get my medicines if I live outside India?</h3>
                  <p className="text-gray-600">
                    After your consultation, Dr. Arti Singh writes your digital prescription. We prepare your custom herbs, package them in compliance with international cargo standards, and dispatch them to your address using global carriers like DHL or FedEx. Tracking details are provided via email and WhatsApp.
                  </p>
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <h3 className="font-bold text-gray-950 mb-2">How are consultations conducted?</h3>
                  <p className="text-gray-600">
                    All sessions are conducted via secure, private video calls (Google Meet/WhatsApp Video). You will receive an automated meeting link in your inbox immediately after selecting your date & time slot on Calendly.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-950 mb-2">Are there extra fees for international custom clearance?</h3>
                  <p className="text-gray-600">
                    For 95%+ of shipments to the USA, UK, and Australia, there are no additional customs fees for personal consumption quantities. In the rare event that custom duties are assessed by local border authorities, they are the responsibility of the recipient.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
