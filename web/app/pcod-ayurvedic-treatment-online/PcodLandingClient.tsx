"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, Shield, Activity, Leaf, Heart, ArrowRight, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import PcodSymptomChecker from "./PcodSymptomChecker"

export default function PcodLandingClient() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-200 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <Badge className="bg-green-100 text-green-800 mb-6 hover:bg-green-100 text-sm px-4 py-1.5 rounded-full font-medium shadow-sm border border-green-200">
                100% Natural • No Artificial Hormones
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Root-Cause <span className="text-green-600">PCOD Ayurvedic Treatment</span> Online
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                Stop suppressing symptoms with birth control pills. Dr. Arti Singh (BAMS) offers a customized, holistic protocol to reverse insulin resistance, dissolve cysts (Granthi), and permanently restore natural ovulation from the comfort of your home.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg text-lg h-14 px-8 rounded-full transition-transform hover:-translate-y-1" asChild>
                  <Link href="/contact">
                    <Calendar className="w-5 h-5 mr-3" />
                    Book Free Video Consultation
                  </Link>
                </Button>
                <div className="flex items-center gap-3 text-sm text-gray-600 px-4 py-2">
                  <div className="flex -space-x-2">
                     <div className="w-8 h-8 rounded-full bg-green-200 border-2 border-white flex items-center justify-center text-xs font-bold text-green-700">★</div>
                     <div className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-white flex items-center justify-center text-xs font-bold text-emerald-700">★</div>
                     <div className="w-8 h-8 rounded-full bg-teal-200 border-2 border-white flex items-center justify-center text-xs font-bold text-teal-700">★</div>
                  </div>
                  <div>
                    <span className="font-bold text-gray-900">500+</span> Women Treated
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
               <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-square max-w-[500px] ml-auto">
                   {/* In a real project, use <Image> with an actual optimized photo of the doctor or clinic */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-green-300 to-emerald-500 overflow-hidden flex items-center justify-center">
                      <Leaf className="w-48 h-48 text-white opacity-20 absolute -bottom-10 -right-10" />
                      <div className="text-center text-white px-8 relative z-10">
                          <Shield className="w-16 h-16 mx-auto mb-4 opacity-90" />
                          <h3 className="text-2xl font-bold mb-2">Ayureva Virtual Clinic</h3>
                          <p className="text-green-50 text-lg">Bringing Ancient Healing to Modern Homes Worldwide</p>
                      </div>
                   </div>
               </div>
               
               {/* Floating Badges */}
               <div className="absolute top-10 -left-10 bg-white p-4 rounded-xl shadow-xl flex items-center gap-4 animate-bounce" style={{animationDuration: '3s'}}>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <Activity className="w-5 h-5" />
                  </div>
                  <div>
                      <p className="font-bold text-gray-900">Regular Cycles</p>
                      <p className="text-xs text-gray-500">Naturally Restored</p>
                  </div>
               </div>
               
               <div className="absolute bottom-20 -right-8 bg-white p-4 rounded-xl shadow-xl flex items-center gap-4 animate-bounce" style={{animationDuration: '4s'}}>
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                      <Heart className="w-5 h-5" />
                  </div>
                  <div>
                      <p className="font-bold text-gray-900">Reduced Pain</p>
                      <p className="text-xs text-gray-500">Cramp-Free Periods</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Symptoms Section */}
      <section className="py-20 border-b border-gray-100">
         <div className="container mx-auto px-4">
             <div className="text-center max-w-3xl mx-auto mb-16">
                 <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Are You Struggling With These PCOD Symptoms?</h2>
                 <p className="text-lg text-gray-600">In Ayurveda, Polycystic Ovarian Disease (PCOD) is primarily a "Kapha-Vata" imbalance that manifests uniquely in every woman.</p>
             </div>
             
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[
                     "Irregular or Absent Periods",
                     "Stubborn Weight Gain (Belly Fat)",
                     "Unwanted Facial Hair (Hirsutism)",
                     "Severe Hair Fall & Thinning",
                     "Chronic Fatigue/Low Energy",
                     "Severe Menstrual Cramping",
                     "Hormonal Cystic Acne",
                     "Difficulty Conceiving (Infertility)",
                 ].map((symptom, index) => (
                     <div key={index} className="bg-gray-50 rounded-xl p-4 flex items-center border border-gray-100 hover:border-green-300 transition-colors">
                         <div className="w-2 h-2 rounded-full bg-red-400 mr-3 hidden sm:block"></div>
                         <span className="font-medium text-gray-800">{symptom}</span>
                     </div>
                 ))}
             </div>
         </div>
      </section>

      {/* Interactive Symptom Checker */}
      <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
              <PcodSymptomChecker />
          </div>
      </section>

      {/* How We Treat It */}
      <section className="py-20 bg-green-50">
          <div className="container mx-auto px-4">
              <div className="lg:flex gap-16 items-center">
                  <div className="lg:w-1/2 mb-12 lg:mb-0">
                      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our 3-Step Ayurvedic PCOD Reversal Protocol</h2>
                      <p className="text-lg text-gray-700 mb-8">Unlike temporary fixes, our online treatments are highly personalized to your specific Prakriti (body type) aiming for <strong>long-term remission.</strong></p>
                      
                      <div className="space-y-8">
                          <div className="flex gap-4">
                              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xl">1</div>
                              <div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-2">Agni Deepana (Metabolism Correction)</h3>
                                  <p className="text-gray-600">We first correct insulin resistance and digestive fire using specific kitchen spices and mild herbs to clear "Ama" (toxins) blocking the reproductive channels.</p>
                              </div>
                          </div>
                          
                          <div className="flex gap-4">
                              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xl">2</div>
                              <div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-2">Granthi Bhedana (Cyst Dissolving)</h3>
                                  <p className="text-gray-600">Prescribing potent scraping herbs like <em>Kanchanar Guggulu</em> and <em>Varuna</em> to naturally shrink ovarian cysts without surgery.</p>
                              </div>
                          </div>
                          
                          <div className="flex gap-4">
                              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xl">3</div>
                              <div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-2">Artava Janana (Restoring Ovulation)</h3>
                                  <p className="text-gray-600">Using uterine tonics like <em>Ashoka</em> and <em>Shatavari</em> based on your cycle phase to trigger natural ovulation and regular bleed.</p>
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  <div className="lg:w-1/2">
                      <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden bg-white">
                          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white text-center">
                              <h3 className="text-2xl font-bold mb-2">How Our Online Clinic Works</h3>
                              <p className="text-emerald-100">Care delivered right to your smartphone</p>
                          </div>
                          <CardContent className="p-8">
                              <ul className="space-y-6">
                                  <li className="flex items-start gap-4">
                                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                          <Calendar className="w-5 h-5" />
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-gray-900 text-lg">Detailed Video Consultation</h4>
                                          <p className="text-gray-600 text-sm mt-1">45-minute deep dive with Dr. Arti into your medical history and lifestyle.</p>
                                      </div>
                                  </li>
                                  <li className="flex items-start gap-4">
                                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                          <Activity className="w-5 h-5" />
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-gray-900 text-lg">Custom Action Plan</h4>
                                          <p className="text-gray-600 text-sm mt-1">Receive a comprehensive PDF identifying your Dosha and exact dietary do's/don'ts.</p>
                                      </div>
                                  </li>
                                  <li className="flex items-start gap-4">
                                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                          <Leaf className="w-5 h-5" />
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-gray-900 text-lg">Medicines Shipped Directly</h4>
                                          <p className="text-gray-600 text-sm mt-1">Authentic, lab-tested Ayurvedic medicines couriered safely to your doorstep.</p>
                                      </div>
                                  </li>
                              </ul>
                              
                              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" size="lg" asChild>
                                      <Link href="/contact">Book Your Slot Today <ArrowRight className="w-4 h-4 ml-2" /></Link>
                                  </Button>
                              </div>
                          </CardContent>
                      </Card>
                  </div>
              </div>
          </div>
      </section>

      {/* SEO FAQs */}
      <section id="faq-section" className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Common Questions About Online PCOD Treatment</h2>
                  <p className="text-gray-600">Everything you need to know before starting your healing journey.</p>
              </div>
              
              <div className="space-y-4">
                 <details className="bg-gray-50 p-6 rounded-xl border border-gray-100 group cursor-pointer" open>
                     <summary className="font-bold text-lg text-gray-900 list-none flex justify-between items-center outline-none">
                         Is online consultation as effective as visiting a clinic?
                         <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
                     </summary>
                     <div className="mt-4 text-gray-700 leading-relaxed pt-4 border-t border-gray-200">
                         Yes! Ayurveda for PCOD relies heavily on detailed case history (Prashna Pariksha), observation (Darshana), and reviewing your lab reports. A secure video call allows Dr. Arti Singh to perform an extremely thorough evaluation without you needing to travel.
                     </div>
                 </details>
                 
                 <details className="bg-gray-50 p-6 rounded-xl border border-gray-100 group cursor-pointer">
                     <summary className="font-bold text-lg text-gray-900 list-none flex justify-between items-center outline-none">
                         How soon will I see results for my PCOD?
                         <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
                     </summary>
                     <div className="mt-4 text-gray-700 leading-relaxed pt-4 border-t border-gray-200">
                         Digestion and energy levels usually improve within the first 2-3 weeks. However, regulating the menstrual cycle and seeing ovarian cysts shrink on an ultrasound typically takes a dedicated commitment of 3 to 6 months.
                     </div>
                 </details>
                 
                 <details className="bg-gray-50 p-6 rounded-xl border border-gray-100 group cursor-pointer">
                     <summary className="font-bold text-lg text-gray-900 list-none flex justify-between items-center outline-none">
                         Do I have to follow a very strict, difficult diet?
                         <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
                     </summary>
                     <div className="mt-4 text-gray-700 leading-relaxed pt-4 border-t border-gray-200">
                         No. We focus on sustainable "Pathya" (beneficial) foods. You won't be starved. Instead, we teach you how to eat according to your Ayurvedic body type, using specific spices to lower the glycemic index of your meals.
                     </div>
                 </details>
                 
                 <details className="bg-gray-50 p-6 rounded-xl border border-gray-100 group cursor-pointer">
                     <summary className="font-bold text-lg text-gray-900 list-none flex justify-between items-center outline-none">
                         Can Ayurvedic treatment help me get pregnant with PCOD?
                         <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
                     </summary>
                     <div className="mt-4 text-gray-700 leading-relaxed pt-4 border-t border-gray-200">
                         Absolutely. PCOD is a leading cause of infertility due to lack of ovulation (anovulation). Our treatments focus deeply on Shukra Dhatu nourishment, which naturally improves egg quality and creates a healthy uterine environment for conception.
                     </div>
                 </details>
              </div>
          </div>
          
          {/* JSON-LD for Landing Page FAQs & HowTo Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify([
                {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "Is online consultation as effective as visiting a clinic?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes! Ayurveda for PCOD relies heavily on detailed case history, observation, and reviewing your lab reports. A secure video call allows Dr. Arti Singh to perform an extremely thorough evaluation without you needing to travel."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How soon will I see results for my PCOD?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Digestion and energy levels usually improve within the first 2-3 weeks. However, regulating the menstrual cycle and seeing ovarian cysts shrink on an ultrasound typically takes a dedicated commitment of 3 to 6 months."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Do I have to follow a very strict, difficult diet?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "No. We focus on sustainable beneficial foods. You won't be starved. Instead, we teach you how to eat according to your Ayurvedic body type, using specific spices to lower the glycemic index of your meals."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Can Ayurvedic treatment help me get pregnant with PCOD?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Absolutely. PCOD is a leading cause of infertility due to lack of ovulation. Our treatments focus deeply on Shukra Dhatu nourishment, which naturally improves egg quality and creates a healthy uterine environment for conception."
                      }
                    }
                  ]
                },
                {
                  "@context": "https://schema.org",
                  "@type": "HowTo",
                  "name": "How to Reverse PCOD Naturally with Ayurveda",
                  "description": "Our 3-Step Ayurvedic PCOD Reversal Protocol aiming for long-term remission.",
                  "step": [
                    {
                      "@type": "HowToStep",
                      "name": "Agni Deepana (Metabolism Correction)",
                      "text": "Correct insulin resistance and digestive fire using specific kitchen spices and mild herbs to clear Ama (toxins)."
                    },
                    {
                      "@type": "HowToStep",
                      "name": "Granthi Bhedana (Cyst Dissolving)",
                      "text": "Prescribe potent scraping herbs like Kanchanar Guggulu to naturally shrink ovarian cysts."
                    },
                    {
                      "@type": "HowToStep",
                      "name": "Artava Janana (Restoring Ovulation)",
                      "text": "Use uterine tonics like Ashoka and Shatavari to trigger natural ovulation and regular bleed."
                    }
                  ]
                }
              ])
            }}
          />
      </section>
    </div>
  )
}
