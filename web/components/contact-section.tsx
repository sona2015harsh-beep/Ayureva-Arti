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

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    success: boolean
    message: string
    errors?: any
  } | null>(null)

  const { trackFormSubmission, trackEmailClick } = useAnalytics()

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
                <CardTitle className="text-2xl">Book Your Free Consultation</CardTitle>
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

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    {isSubmitting ? "Submitting..." : "Book Free Consultation"}
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
      </div>
    </section>
  )
}
