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
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg relative p-4">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors z-10"
              aria-label="Close popup"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2 pr-10">
              <Heart className="w-6 h-6" />
              <CardTitle className="text-xl">Free Consultation Available!</CardTitle>
            </div>
            <CardDescription className="text-green-100 pr-10">
              Get expert Ayurvedic treatment for PCOS, PCOD & women's health issues
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4">
            <div className="mb-4 text-center">
              <p className="text-gray-600 text-sm">
                🌿 <strong>Dr. Arti Singh</strong> - BAMS Qualified Ayurvedic Specialist
              </p>
              <p className="text-green-600 text-sm font-medium mt-1">✨ Natural • Safe • Effective Treatment</p>
            </div>

            <form id="popup-contact-form" action={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    name="firstName"
                    placeholder="First Name *"
                    required
                    disabled={isSubmitting}
                    className="text-sm h-9"
                  />
                </div>
                <div>
                  <Input
                    name="lastName"
                    placeholder="Last Name *"
                    required
                    disabled={isSubmitting}
                    className="text-sm h-9"
                  />
                </div>
              </div>

              <Input
                name="email"
                type="email"
                placeholder="Email Address *"
                required
                disabled={isSubmitting}
                className="text-sm h-9"
              />

              <Input
                name="phone"
                type="tel"
                placeholder="Phone Number *"
                required
                disabled={isSubmitting}
                className="text-sm h-9"
              />

              <Textarea
                name="healthConcern"
                placeholder="Describe your health concern (PCOS, irregular periods, etc.) *"
                rows={2}
                required
                disabled={isSubmitting}
                className="text-sm resize-none"
              />

              {submitResult && (
                <div
                  className={`p-3 rounded-lg flex items-start space-x-2 text-sm ${submitResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                    }`}
                >
                  {submitResult.success ? (
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <p className={submitResult.success ? "text-green-800" : "text-red-800"}>{submitResult.message}</p>
                </div>
              )}

              <div className="space-y-2">
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium h-10"
                  disabled={isSubmitting}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Book Free Consultation"}
                </Button>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs bg-transparent h-8"
                    onClick={handleRemindLater}
                    disabled={isSubmitting}
                  >
                    Remind Me Later
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-xs text-gray-500 h-8"
                    onClick={handlePermanentDismiss}
                    disabled={isSubmitting}
                  >
                    No Thanks
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">📞 Prefer to call? Email: drartisingh1102@gmail.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
