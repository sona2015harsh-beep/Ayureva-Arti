"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

const questions = [
  "Do you experience irregular or entirely missed menstrual cycles?",
  "Have you noticed unusual weight gain, especially around your abdomen, that is hard to lose?",
  "Do you struggle with excessive facial or body hair (hirsutism)?",
  "Are you experiencing severe hair thinning or male-pattern baldness?",
  "Do you frequently get deep, painful cystic acne along your jawline?",
  "Have you been trying to conceive without success for over 6 months?"
]

export default function PcodSymptomChecker() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (isYes: boolean) => {
    if (isYes) setScore(score + 1)
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowResults(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100 max-w-2xl mx-auto my-12">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white text-center">
        <h3 className="text-2xl font-bold mb-2">Interactive PCOD Risk Assessment</h3>
        <p className="text-emerald-100 text-sm">Take this 30-second quiz to see your Ayurvedic risk profile.</p>
      </div>

      <div className="p-8">
        {!showResults ? (
          <div>
            <div className="mb-6 flex justify-between items-center text-sm font-medium text-gray-400">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">{Math.round(((currentQuestion) / questions.length) * 100)}% Complete</span>
            </div>
            
            <h4 className="text-xl font-semibold text-gray-900 mb-8 min-h-[60px]">
              {questions[currentQuestion]}
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 border-red-200 hover:bg-red-50 hover:text-red-700 font-semibold"
                onClick={() => handleAnswer(false)}
              >
                No
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 border-green-200 hover:bg-green-50 hover:text-green-700 font-semibold"
                onClick={() => handleAnswer(true)}
              >
                Yes
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 text-orange-600 mb-6">
              {score >= 3 ? <AlertCircle className="w-10 h-10" /> : <CheckCircle className="w-10 h-10 text-emerald-600" />}
            </div>
            
            <h4 className="text-2xl font-bold text-gray-900 mb-4">
              Your Symptom Score: {score}/{questions.length}
            </h4>
            
            <p className="text-gray-600 mb-8">
              {score >= 3 
                ? "Your score indicates a high probability of Kapha-Vata dominant PCOD/PCOS. This hormonal imbalance is likely driving your symptoms. Root-cause Ayurvedic treatment is strongly recommended to restore your natural cycle."
                : score > 0 
                ? "You are exhibiting mild signs of hormonal imbalance. Left unchecked, these Kapha disruptions can escalate into full PCOD. Early dietary intervention is recommended."
                : "Great news! You are currently showing no major clinical signs of PCOD. Maintain your healthy Dinacharya (lifestyle) to keep your hormones balanced."}
            </p>

            <div className="space-y-4">
              {(score > 0) && (
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 text-lg rounded-xl" asChild>
                  <Link href="/contact">
                    Discuss Your Results with Dr. Arti <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              )}
              <Button variant="ghost" className="w-full text-gray-500 hover:text-gray-900" onClick={resetQuiz}>
                Retake Assessment
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
