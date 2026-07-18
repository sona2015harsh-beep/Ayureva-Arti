"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, ChevronRight, Activity, ArrowRight, ShieldCheck, Heart, Sparkles } from "lucide-react"

interface Question {
  id: number
  text: string
  options: { label: string; score: number; dosha: "vata" | "pitta" | "kapha" | "none" }[]
}

export default function PCOSSymptomCheckerClient() {
  const [step, setStep] = useState<number>(0) // 0: intro, 1-5: questions, 6: results
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedDoshas, setSelectedDoshas] = useState<string[]>([])

  const questions: Question[] = [
    {
      id: 1,
      text: "How regular are your menstrual periods?",
      options: [
        { label: "Regular cycle (every 28–32 days)", score: 0, dosha: "none" },
        { label: "Slightly late or irregular (35–45 days cycle)", score: 1, dosha: "vata" },
        { label: "Very irregular (often skip months or missing for 3+ months)", score: 3, dosha: "vata" }
      ]
    },
    {
      id: 2,
      text: "Do you experience stubbon cystic acne, especially along the jawline?",
      options: [
        { label: "Rarely or none", score: 0, dosha: "none" },
        { label: "Occasional outbreaks before periods", score: 1, dosha: "pitta" },
        { label: "Severe, persistent jawline acne", score: 2, dosha: "pitta" }
      ]
    },
    {
      id: 3,
      text: "Have you noticed excessive dark hair growth on chin, upper lip, chest, or abdomen?",
      options: [
        { label: "No unusual hair growth", score: 0, dosha: "none" },
        { label: "Mild hair growth in 1 or 2 areas (hirsutism)", score: 1, dosha: "kapha" },
        { label: "Moderate to severe thick hair growth in multiple areas", score: 3, dosha: "kapha" }
      ]
    },
    {
      id: 4,
      text: "Have you experienced sudden, stubborn weight gain, especially around the belly?",
      options: [
        { label: "No, my weight is stable", score: 0, dosha: "none" },
        { label: "Yes, gained a few kgs that are hard to lose", score: 1, dosha: "kapha" },
        { label: "Yes, significant stubborn abdominal weight gain despite workout/dieting", score: 3, dosha: "kapha" }
      ]
    },
    {
      id: 5,
      text: "Do you suffer from chronic fatigue, brain fog, or intense sugar cravings?",
      options: [
        { label: "No, energy is good", score: 0, dosha: "none" },
        { label: "Yes, occasional fatigue or sweet cravings", score: 1, dosha: "kapha" },
        { label: "Yes, constant sluggishness, severe energy crashes, and intense cravings", score: 2, dosha: "kapha" }
      ]
    }
  ]

  const handleStart = () => {
    setAnswers([])
    setSelectedDoshas([])
    setStep(1)
  }

  const handleAnswer = (score: number, dosha: string) => {
    const updatedAnswers = [...answers, score]
    setAnswers(updatedAnswers)
    
    if (dosha !== "none" && !selectedDoshas.includes(dosha)) {
      setSelectedDoshas([...selectedDoshas, dosha])
    }

    if (step < 5) {
      setStep(step + 1)
    } else {
      setStep(6) // show results
    }
  }

  // Calculate results
  const totalScore = answers.reduce((a, b) => a + b, 0)
  
  let riskLevel: "low" | "moderate" | "high" = "low"
  let riskDescription = ""
  let riskColor = ""

  if (totalScore >= 7) {
    riskLevel = "high"
    riskDescription = "High Risk of PCOS/PCOD"
    riskColor = "text-red-700 bg-red-50 border-red-200"
  } else if (totalScore >= 3) {
    riskLevel = "moderate"
    riskDescription = "Moderate Risk of Hormonal Imbalance"
    riskColor = "text-amber-700 bg-amber-50 border-amber-200"
  } else {
    riskLevel = "low"
    riskDescription = "Low Risk of PCOS"
    riskColor = "text-green-700 bg-green-50 border-green-200"
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-xl">
        {step === 0 && (
          <Card className="bg-white border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="text-center space-y-3">
              <Badge className="bg-green-150 text-green-800 hover:bg-green-150">Hormonal Health Assessment</Badge>
              <h1 className="text-3xl font-black text-gray-900 font-serif leading-tight">
                PCOS & PCOD Symptom Checker
              </h1>
              <p className="text-xs text-gray-500 leading-relaxed">
                Take our 5-step risk assessment tool to analyze cycles, androgenic symptoms, and sluggish metabolic markers. Receive a preliminary Ayurvedic Dosha mapping.
              </p>
            </div>

            <div className="bg-green-50/30 border border-green-50 rounded-2xl p-4 flex gap-3 items-start text-xs text-gray-700 leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
              <span>
                <strong>Clinical Note:</strong> This tool is for educational risk profiling. It does not replace a clinical ultrasound or medical diagnosis.
              </span>
            </div>

            <Button onClick={handleStart} className="w-full bg-green-750 hover:bg-green-800 text-white font-bold h-12 rounded-xl text-base flex items-center justify-center gap-1.5">
              Begin Assessment <ChevronRight className="w-5 h-5" />
            </Button>
          </Card>
        )}

        {step > 0 && step <= 5 && (
          <div className="space-y-6">
            {/* Stepper bar */}
            <div className="flex justify-between items-center text-xs text-gray-400 font-semibold px-1">
              <span>Question {step} of 5</span>
              <span>{Math.round(((step - 1) / 5) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="bg-green-750 h-full transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }}></div>
            </div>

            <Card className="bg-white border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-gray-900 font-serif leading-snug">
                {questions[step - 1].text}
              </h2>
              <div className="space-y-3">
                {questions[step - 1].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt.score, opt.dosha)}
                    className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-green-600 hover:bg-green-50/20 transition-all font-medium text-xs text-gray-700 flex justify-between items-center group"
                  >
                    <span>{opt.label}</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-green-700 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {step === 6 && (
          <Card className="bg-white border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-150 rounded-full flex items-center justify-center mx-auto text-green-750 border border-green-200">
                <Activity className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 font-serif">Your Risk Profiling</h1>
            </div>

            <div className={`p-4 border rounded-2xl flex items-center gap-3 text-xs font-bold justify-center uppercase tracking-wider ${riskColor}`}>
              {riskLevel === "high" && <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />}
              {riskLevel === "moderate" && <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />}
              {riskLevel === "low" && <CheckCircle className="w-5 h-5 text-green-700 shrink-0" />}
              <span>{riskDescription}</span>
            </div>

            <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
              <h3 className="font-bold text-gray-900 text-sm border-b pb-2">Ayurvedic Dosha Imbalance Profiling:</h3>
              
              {selectedDoshas.length === 0 ? (
                <p>No major systemic Dosha imbalances detected. Your cycle parameters appear stable.</p>
              ) : (
                <div className="space-y-3">
                  {selectedDoshas.includes("vata") && (
                    <div>
                      <strong className="text-gray-900 font-semibold block mb-0.5">Apana Vata Obstruction (Irregular Cycles)</strong>
                      <p className="text-gray-500 text-[11px] leading-relaxed">
                        Irregular or delayed menstruation indicates dry/un-channeled Vata blocking the pelvic cavity, obstructing natural follicular flow.
                      </p>
                    </div>
                  )}
                  {selectedDoshas.includes("pitta") && (
                    <div>
                      <strong className="text-gray-900 font-semibold block mb-0.5">Rakta Pitta Inflammation (Acne & Heat)</strong>
                      <p className="text-gray-500 text-[11px] leading-relaxed">
                        Cystic acne along the jawline points to heat blockages in the blood tissues (Rakta Dhatu), causing toxic hot skin outbreaks.
                      </p>
                    </div>
                  )}
                  {selectedDoshas.includes("kapha") && (
                    <div>
                      <strong className="text-gray-900 font-semibold block mb-0.5">Kapha Stagnation & Ama (Weight & Hirsutism)</strong>
                      <p className="text-gray-500 text-[11px] leading-relaxed">
                        Slow metabolism, sweet cravings, and hirsutism indicate excess Kapha fluid clogging ovarian tissues, preventing correct follicle growth.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Next Steps CTA */}
            <div className="bg-green-50/20 border border-green-100 rounded-2xl p-5 text-center space-y-4">
              <Sparkles className="w-6 h-6 text-green-700 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 text-xs">Consult Dr. Arti Singh (B.A.M.S.)</h4>
                <p className="text-2xs text-gray-500 leading-relaxed">
                  Address these imbalances at their root cause. Get a customized cooling diet plan and registered Ayurvedic prescriptions.
                </p>
              </div>
              <Button className="w-full bg-green-750 hover:bg-green-800 text-white font-bold rounded-xl text-xs h-10" asChild>
                <Link href="/contact">Book Root-Cause Consultation</Link>
              </Button>
            </div>

            <Button onClick={() => setStep(0)} variant="ghost" className="w-full text-xs text-gray-400 hover:text-gray-650 h-8">
              ✕ Retake Assessment
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
