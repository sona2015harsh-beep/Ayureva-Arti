"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Calendar, CheckCircle, AlertCircle, Heart } from "lucide-react"
import { submitContactForm } from "@/actions/contact-form"
import { submitContactFormFallback } from "@/actions/contact-form-fallback"
import { useAnalytics } from "@/lib/analytics"
import { usePathname } from "next/navigation"

interface ConsultationPopupProps {
  isOpen: boolean
  onClose: () => void
  onRemindLater: () => void
  onPermanentDismiss?: () => void
}

export default function ConsultationPopup({
  isOpen,
  onClose,
  onRemindLater,
  onPermanentDismiss,
}: ConsultationPopupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    success: boolean
    message: string
    errors?: any
  } | null>(null)

  const { trackFormSubmission, trackEvent } = useAnalytics()

  // Close popup when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  const pathname = usePathname() || ""

  // Dynamic context mapping
  const getLeadMagnetContent = (path: string) => {
    const lowerPath = path.toLowerCase()
    
    if (lowerPath.includes("thyroid")) {
      return {
        title: "Free 7-Day Ayurvedic Thyroid Balancing Guide 🌿",
        desc: "Struggling with fatigue and weight? Download Dr. Arti's natural dosha-balancing thyroid diet plan.",
        bullets: ["Metabolism-boosting recipes", "Herbs to support T3/T4 conversion", "100% Free, delivered instantly"],
        payload: "Requested the Free Thyroid Balancing Guide PDF"
      }
    } else if (lowerPath.includes("infertility") || lowerPath.includes("egg") || lowerPath.includes("pregnancy")) {
      return {
        title: "The Ayurvedic Fertility Boosting Checklist 🌿",
        desc: "Discover the exact foods and lifestyle shifts to deeply nourish your Shukra Dhatu for healthy conception.",
        bullets: ["Foods to improve egg quality", "Panchakarma preparation tips", "100% Free, delivered instantly"],
        payload: "Requested the Free Ayurvedic Fertility Checklist PDF"
      }
    } else if (lowerPath.includes("uti") || lowerPath.includes("menstrual") || lowerPath.includes("period")) {
      return {
        title: "Natural Relief Guide for Menstrual Health & UTIs 🌿",
        desc: "Break free from painful cramps and recurring UTIs using potent Ayurvedic kitchen remedies.",
        bullets: ["Pitta-cooling drink recipes", "Immediate pain relief techniques", "100% Free, delivered instantly"],
        payload: "Requested the Menstrual & UTI Natural Relief Guide PDF"
      }
    } else if (lowerPath.includes("pcos") || lowerPath.includes("pcod")) {
      return {
        title: "Get Your Free 7-Day Ayurvedic PCOS Diet Plan 🌿",
        desc: "Stop starving yourself. Download Dr. Arti's personalized dosha-balancing diet guide directly to your inbox.",
        bullets: ["Exact meals to reverse insulin resistance", "Ayurvedic spices to dissolve cysts", "100% Free, delivered instantly"],
        payload: "Requested the Free 7-Day Ayurvedic PCOS Diet Plan PDF"
      }
    } else {
      // Default / Global
      return {
        title: "Dr. Arti's Complete Women's Health Handbook 🌿",
        desc: "Discover the ancient secrets to balancing your hormones natively without clinical side-effects.",
        bullets: ["Daily Dinacharya lifestyle routines", "Top 5 hormone-balancing foods", "100% Free, delivered instantly"],
        payload: "Requested the Complete Women's Health Handbook PDF"
      }
    }
  }

  const content = getLeadMagnetContent(pathname)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setSubmitResult(null)

    // Track popup form submission attempt
    trackEvent("popup_form_submit_attempt", "engagement", "consultation_popup")

    // Try the main email service first, then fallback
    let result = await submitContactForm(formData)

    // If email service fails, use fallback method
    if (!result.success && result.message.includes("Email service")) {
      result = await submitContactFormFallback(formData)
    }

    setSubmitResult(result)
    setIsSubmitting(false)

    // Track form submission
    trackFormSubmission("popup_consultation_form", result.success)

    if (result.success) {
      // Reset form
      const form = document.getElementById("popup-contact-form") as HTMLFormElement
      form?.reset()

      // Close popup after successful submission
      setTimeout(() => {
        onClose()
      }, 3000)
    }
  }

  const handleClose = () => {
    trackEvent("popup_close", "engagement", "consultation_popup")
    onClose()
  }

  const handleRemindLater = () => {
    trackEvent("popup_remind_later", "engagement", "consultation_popup")
    onRemindLater()
  }

  const handlePermanentDismiss = () => {
    trackEvent("popup_permanent_dismiss", "engagement", "consultation_popup")
    if (onPermanentDismiss) {
      onPermanentDismiss()
    } else {
      onClose()
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Popup Content */}
      <div className="relative z-10 w-full max-w-lg mx-auto max-h-[85vh] overflow-y-auto">
        <Card className="border-2 border-green-200 shadow-2xl animate-in fade-in duration-300">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-t-lg relative p-6">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors z-10"
              aria-label="Close popup"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-2 pr-10">
              <div className="bg-white/20 p-2 rounded-full hidden sm:block">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold leading-tight">{content.title}</CardTitle>
            </div>
            <CardDescription className="text-emerald-100 pr-10 text-base mt-2">
              {content.desc}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <div className="mb-6 space-y-2">
              <p className="flex items-center gap-2 text-gray-700 text-sm"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> <span className="truncate">{content.bullets[0]}</span></p>
              <p className="flex items-center gap-2 text-gray-700 text-sm"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> <span className="truncate">{content.bullets[1]}</span></p>
              <p className="flex items-center gap-2 text-gray-700 text-sm"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> <span className="truncate">{content.bullets[2]}</span></p>
            </div>

            <form id="popup-contact-form" action={handleSubmit} className="space-y-4">
              {/* Hidden fields to satisfy the backend action requirements without annoying the user */}
              <input type="hidden" name="lastName" value="[Lead Magnet]" />
              <input type="hidden" name="healthConcern" value={content.payload} />

              <div>
                <Input
                  name="firstName"
                  placeholder="Your First Name *"
                  required
                  disabled={isSubmitting}
                  className="h-12 bg-gray-50 border-gray-200"
                />
              </div>

              <div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Your Best Email Address *"
                  required
                  disabled={isSubmitting}
                  className="h-12 bg-gray-50 border-gray-200"
                />
              </div>

              <div>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="WhatsApp Number (For instant PDF delivery) *"
                  required
                  disabled={isSubmitting}
                  className="h-12 bg-gray-50 border-gray-200"
                />
              </div>

              {submitResult && (
                <div
                  className={`p-3 rounded-xl flex items-start space-x-2 text-sm ${submitResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                    }`}
                >
                  {submitResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                  <p className={`font-medium ${submitResult.success ? "text-green-800" : "text-red-800"}`}>{submitResult.success ? "Success! Your free diet plan will be emailed to you shortly." : submitResult.message}</p>
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 text-lg rounded-xl shadow-lg transition-transform hover:-translate-y-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Me The Free Guide Now"}
                </Button>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    className="text-sm text-gray-400 hover:text-gray-600 underline decoration-gray-300 underline-offset-4"
                    onClick={handlePermanentDismiss}
                    disabled={isSubmitting}
                  >
                    No thanks, I don't want to heal my PCOS naturally
                  </button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
