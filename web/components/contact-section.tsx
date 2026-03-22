"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Calendar, CheckCircle, AlertCircle } from "lucide-react"
import { submitContactForm } from "@/actions/contact-form"
import { submitContactFormFallback } from "@/actions/contact-form-fallback"
import { useAnalytics } from "@/lib/analytics"
import { useGeoPricing } from "@/hooks/use-geo-pricing"

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    success: boolean
    message: string
    errors?: any
  } | null>(null)

  const { trackFormSubmission, trackEmailClick } = useAnalytics()
  const { pricing, isLoading } = useGeoPricing()

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setSubmitResult(null)

    // Try the main email service first, then fallback
    let result = await submitContactForm(formData)

    // If email service fails, use fallback method
    if (!result.success && result.message.includes("Email service")) {
      console.log("Email service failed, using fallback method...")
      result = await submitContactFormFallback(formData)
    }

    setSubmitResult(result)
    setIsSubmitting(false)

    // Track form submission
    trackFormSubmission("contact_form", result.success)

    if (result.success) {
      // Reset form
      const form = document.getElementById("contact-form") as HTMLFormElement
      form?.reset()
    }
  }

  const handleEmailClick = () => {
    trackEmailClick("contact_page")
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-r from-green-50 to-emerald-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">Contact Ayureva</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Consultation with Dr. Arti Singh</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Schedule your appointment with India's leading Ayurvedic women's health specialist. Get expert treatment for
            PCOS, PCOD, menstrual disorders, and complete wellness solutions. Online consultations available worldwide.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Book Your Video Consultation</CardTitle>
                <CardDescription>
                  Fill out the form below and Dr. Arti Singh will contact you within 24 hours to schedule your
                  appointment. Online consultations available for international patients.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form id="contact-form" action={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">First Name *</label>
                      <Input name="firstName" placeholder="Enter your first name" required disabled={isSubmitting} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Last Name *</label>
                      <Input name="lastName" placeholder="Enter your last name" required disabled={isSubmitting} />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address *</label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Phone Number *</label>
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Health Concern *</label>
                    <Textarea
                      name="healthConcern"
                      placeholder="Please describe your health concerns, symptoms, or questions in detail. This helps Dr. Arti Singh prepare for your consultation."
                      rows={4}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {submitResult && (
                    <div
                      className={`p-4 rounded-lg flex items-start space-x-3 ${
                        submitResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                      }`}
                    >
                      {submitResult.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <p className={`text-sm ${submitResult.success ? "text-green-800" : "text-red-800"}`}>
                        {submitResult.message}
                      </p>
                    </div>
                  )}

                  {/* Dynamic Geo-Pricing Display */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mt-6 mb-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-sm font-semibold text-gray-700">Online Consultation Fee:</span>
                       {isLoading ? (
                         <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
                       ) : (
                         <span className="text-lg font-bold text-green-700 bg-green-100 px-3 py-1 rounded-md">
                           {pricing.label}
                         </span>
                       )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Pricing is automatically adjusted based on your physical location to ensure fair global access.
                    </p>
                  </div>

                  {/* Mandatory Payment Terms */}
                  <div className="flex items-start mb-6 bg-yellow-50/50 p-3 rounded border border-yellow-100">
                    <div className="flex items-center h-5">
                      <input
                        id="payment-terms"
                        name="payment_terms_accepted"
                        type="checkbox"
                        required
                        className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                      />
                    </div>
                    <label htmlFor="payment-terms" className="ml-2 text-sm text-gray-700 cursor-pointer">
                      I agree to pay the <span className="font-semibold">{isLoading ? 'consultation fee' : pricing.label}</span> consultation fee. I understand that after submitting this form, I will receive a secure payment link and a Calendly scheduling link via email/WhatsApp to confirm my video consultation slot.
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg h-14 rounded-xl shadow-lg transition-transform hover:-translate-y-1"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    <Calendar className="w-5 h-5 mr-3" />
                    {isSubmitting ? "Submitting Request..." : "Request Video Consultation"}
                  </Button>
                </form>

                {/* Alternative Contact Methods - Phone number removed */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Prefer Direct Contact?</h4>
                  <div className="space-y-2">
                    <a
                      href="mailto:drartisingh1102@gmail.com"
                      className="flex items-center text-blue-700 hover:text-blue-900 transition-colors"
                      onClick={handleEmailClick}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email: drartisingh1102@gmail.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">
                      <a
                        href="mailto:drartisingh1102@gmail.com"
                        className="hover:text-green-600"
                        onClick={handleEmailClick}
                      >
                        drartisingh1102@gmail.com
                      </a>
                    </p>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Clinic Address</h4>
                    <p className="text-gray-600">
                      Road No - 13B, Bahadurpur Gumati, Rajendra Nagar
                      <br />
                      Patna - 800016, Bihar
                    </p>
                    <p className="text-sm text-gray-500">Easy parking available</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-green-100">
              <h4 className="font-semibold text-gray-900 mb-3">Consultation Hours</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium text-red-600">Closed</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-900 mb-3">Why Choose Ayureva?</h4>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  BAMS qualified Ayurvedic specialist
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Expert in PCOS, PCOD treatment
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Natural & safe treatment methods
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Online consultations available
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQs for AEO (Position #0) */}
        <div className="mt-20 pt-12 border-t border-green-100 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Important information before booking your consultation.</p>
          </div>

          <div className="space-y-4">
            <details className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group cursor-pointer" open>
              <summary className="font-bold text-lg text-gray-900 list-none flex justify-between items-center outline-none">
                How quickly will Dr. Arti Singh review my consultation request?
                <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-600 leading-relaxed font-medium pt-4 border-t border-gray-50">
                Our team monitors all consultation requests closely. Dr. Arti Singh or her clinic coordinator will contact you within 24 hours (excluding Sundays) via email or phone to confirm your appointment time and provide the next steps for your Ayurvedic treatment.
              </div>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group cursor-pointer">
              <summary className="font-bold text-lg text-gray-900 list-none flex justify-between items-center outline-none">
                Where is Dr. Arti Singh's Ayurvedic clinic physically located?
                <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-600 leading-relaxed font-medium pt-4 border-t border-gray-50">
                Ayureva Clinic is located at Road No - 13B, Bahadurpur Gumati, Rajendra Nagar, Patna - 800016, Bihar. However, we serve women worldwide through our highly effective online Ayurvedic consultation platform.
              </div>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group cursor-pointer">
              <summary className="font-bold text-lg text-gray-900 list-none flex justify-between items-center outline-none">
                How do I book an online Ayurvedic consultation for PCOS?
                <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-600 leading-relaxed font-medium pt-4 border-t border-gray-50">
                Simply fill out the contact form on this page with your details and mention 'PCOS Online Consultation' in the health concern box. We will arrange a secure video call consultation where Dr. Arti Singh will diagnose your condition and prescribe targeted Ayurvedic protocols.
              </div>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group cursor-pointer">
              <summary className="font-bold text-lg text-gray-900 list-none flex justify-between items-center outline-none">
                What should I prepare before my first Ayurvedic consultation?
                <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-600 leading-relaxed font-medium pt-4 border-t border-gray-50">
                Please gather your recent medical reports (like pelvic ultrasounds, thyroid panels, or hormone tests), a detailed summary of your current symptoms, your menstrual cycle history, and a list of any allopathic medicines or supplements you are currently taking.
              </div>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group cursor-pointer">
              <summary className="font-bold text-lg text-gray-900 list-none flex justify-between items-center outline-none">
                What languages does Dr. Arti Singh speak during consultations?
                <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-600 leading-relaxed font-medium pt-4 border-t border-gray-50">
                Dr. Arti Singh is highly fluent in both English and Hindi. She conducts consultations comfortably in either language depending on the patient's preference, ensuring clear communication of complex Ayurvedic and medical concepts.
              </div>
            </details>
          </div>
        </div>

        {/* JSON-LD FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How quickly will Dr. Arti Singh review my consultation request?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our team monitors all consultation requests closely. Dr. Arti Singh or her clinic coordinator will contact you within 24 hours (excluding Sundays) via email or phone to confirm your appointment time and provide the next steps for your Ayurvedic treatment."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Where is Dr. Arti Singh's Ayurvedic clinic physically located?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ayureva Clinic is located at Road No - 13B, Bahadurpur Gumati, Rajendra Nagar, Patna - 800016, Bihar. However, we serve women worldwide through our highly effective online Ayurvedic consultation platform."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do I book an online Ayurvedic consultation for PCOS?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Simply fill out the contact form on this page with your details and mention 'PCOS Online Consultation' in the health concern box. We will arrange a secure video call consultation where Dr. Arti Singh will diagnose your condition and prescribe targeted Ayurvedic protocols."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What should I prepare before my first Ayurvedic consultation?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Please gather your recent medical reports (like pelvic ultrasounds, thyroid panels, or hormone tests), a detailed summary of your current symptoms, your menstrual cycle history, and a list of any allopathic medicines or supplements you are currently taking."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What languages does Dr. Arti Singh speak during consultations?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Dr. Arti Singh is highly fluent in both English and Hindi. She conducts consultations comfortably in either language depending on the patient's preference, ensuring clear communication of complex Ayurvedic and medical concepts."
                  }
                }
              ]
            })
          }}
        />

      </div>
    </section>
  )
}
