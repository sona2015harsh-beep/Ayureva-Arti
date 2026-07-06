"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Calendar, CheckCircle, AlertCircle, Truck, Clock, FileText } from "lucide-react"
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

                  {/* Dynamic Geo-Pricing Display & Value Stack */}
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mt-6 mb-4 relative overflow-hidden shadow-xs">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-green-600"></div>
                    
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-sm font-bold text-gray-800">
                         Specialist Online Consultation Fee {isLoading ? "" : `(${pricing.countryName})`}:
                       </span>
                       {isLoading ? (
                         <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
                       ) : (
                         <span className="text-lg font-bold text-green-800 bg-green-100 px-3 py-1 rounded-lg">
                           {pricing.label}
                         </span>
                       )}
                    </div>
                    
                    {/* Value Stack */}
                    <div className="mt-4 text-xs text-gray-600 space-y-1.5 border-t border-gray-200 pt-4">
                      <p className="font-bold text-gray-800 text-[11px] uppercase tracking-wide">What is Included:</p>
                      <ul className="space-y-1 pl-4 list-disc text-gray-700">
                        <li><strong>45–60 min private video consultation</strong> with Dr. Arti Singh</li>
                        <li><strong>Personalized treatment plan</strong> based on your Dosha type</li>
                        <li><strong>Official digital prescription</strong> document and symptom logs</li>
                        <li><strong>Customized Ayurvedic diet & lifestyle</strong> counseling</li>
                        <li><strong>Direct messaging support</strong> for follow-up questions</li>
                        <li><strong>Doorstep herbal medicine shipping assistance</strong> (where available)</li>
                      </ul>
                    </div>

                    {/* Follow-up Pricing Card */}
                    <div className="mt-4 bg-green-50/50 p-3.5 rounded-xl border border-green-100 text-xs">
                      <p className="font-bold text-green-800 mb-2 flex items-center gap-1">
                        🔁 Follow-up Care Pricing:
                      </p>
                      <div className="grid grid-cols-2 gap-y-1 text-gray-600 text-[11px]">
                        <div>• Follow-up (within 30 days):</div>
                        <div className="font-semibold text-right text-gray-800">
                          {pricing.currency === "INR" ? "₹300 INR" : pricing.currency === "AED" ? "149 AED" : pricing.currency === "GBP" ? "£39 GBP" : pricing.currency === "EUR" ? "€45 EUR" : "$49 USD"}
                        </div>
                        <div>• Follow-up (after 30 days):</div>
                        <div className="font-semibold text-right text-gray-800">
                          {pricing.currency === "INR" ? "₹400 INR" : pricing.currency === "AED" ? "199 AED" : pricing.currency === "GBP" ? "£59 GBP" : pricing.currency === "EUR" ? "€65 EUR" : "$69 USD"}
                        </div>
                      </div>
                    </div>

                    {/* Transparency Disclaimer */}
                    <p className="text-[10px] text-gray-400 mt-4 leading-normal italic">
                      No hidden consultation charges. Your local currency is shown automatically based on your country. Medicine costs (if prescribed) and shipping are separate and will be discussed transparently before any purchase.
                    </p>

                    {/* Payment trust icons */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 justify-center text-[10px] text-gray-400">
                      <span>Secure Checkout:</span>
                      <span className="font-bold px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">VISA</span>
                      <span className="font-bold px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">MC</span>
                      <span className="font-bold px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">AMEX</span>
                      {pricing.currency === "INR" ? (
                        <span className="font-bold px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">UPI</span>
                      ) : (
                        <span className="font-bold px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">PAYPAL</span>
                      )}
                    </div>
                  </div>

                  {/* Mandatory Payment Terms */}
                  <div className="flex items-start mb-6 bg-yellow-50/50 p-4 rounded-xl border border-yellow-100">
                    <div className="flex items-center h-5">
                      <input
                        id="payment-terms"
                        name="payment_terms_accepted"
                        type="checkbox"
                        required
                        className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                      />
                    </div>
                    <label htmlFor="payment-terms" className="ml-2.5 text-xs text-gray-650 cursor-pointer leading-normal">
                      I agree to pay the <span className="font-bold">{isLoading ? 'consultation fee' : pricing.label}</span> fee. I understand that after submitting this form, I will receive a secure payment link and a Calendly scheduling link via email/WhatsApp to confirm my video consultation slot.
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
            {/* Worldwide Shipping Banner */}
            <div className="bg-emerald-800 text-white p-6 rounded-2xl shadow-md border-l-8 border-green-400 relative overflow-hidden flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Truck className="w-6 h-6 text-green-300 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">📦 Worldwide Medicine Delivery</h4>
                <p className="text-green-100 text-sm leading-relaxed">
                  We safely ship certified Ayurvedic herbal formulations directly to your doorstep in the <strong>USA, UK, Europe, UAE, Canada, and Australia</strong>. Customs clearance and tracking are fully managed by our international logistics partner.
                </p>
              </div>
            </div>

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

            {/* Prepare for Consultation checklist */}
            <div className="bg-yellow-50/50 p-6 rounded-2xl border border-yellow-200">
              <h4 className="font-bold text-yellow-950 text-base mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-800" />
                What to Prepare Before Your Consultation
              </h4>
              <p className="text-gray-700 text-xs mb-4">
                To help Dr. Arti Singh understand the exact root cause of your condition, please keep the following ready:
              </p>
              <ul className="space-y-3 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Recent Diagnostic Reports:</strong> Pelvic ultrasound (USG), thyroid panels, or hormone profiles (if done in the last 6 months).
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Menstrual Cycle Details:</strong> Date of last period, cycle length regularity, and symptoms.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Active Medications:</strong> A list of any active prescriptions (like birth control pills, metformin, or thyroid tablets).
                  </div>
                </li>
              </ul>
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

            {/* Patient Journey Timeline */}
            <div className="bg-white p-6 rounded-2xl border-2 border-green-100 shadow-sm">
              <h4 className="font-bold text-gray-900 text-base mb-5 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                Your Booking & Consultation Journey
              </h4>
              <div className="relative border-l border-green-200 pl-5 ml-2.5 space-y-6">
                {/* Step 1 */}
                <div className="relative">
                  <span className="absolute -left-[27px] top-0.5 bg-green-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-2xs font-bold ring-4 ring-white">1</span>
                  <h5 className="font-bold text-gray-900 text-xs mb-0.5">Submit Request</h5>
                  <p className="text-gray-500 text-2xs leading-relaxed">Fill out your health symptoms and details in the booking form.</p>
                </div>
                {/* Step 2 */}
                <div className="relative">
                  <span className="absolute -left-[27px] top-0.5 bg-green-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-2xs font-bold ring-4 ring-white">2</span>
                  <h5 className="font-bold text-gray-900 text-xs mb-0.5">Coordinator Contact</h5>
                  <p className="text-gray-500 text-2xs leading-relaxed">Our coordinator connects with you on WhatsApp/Email within 24 hours to confirm timezone compatibility.</p>
                </div>
                {/* Step 3 */}
                <div className="relative">
                  <span className="absolute -left-[27px] top-0.5 bg-green-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-2xs font-bold ring-4 ring-white">3</span>
                  <h5 className="font-bold text-gray-900 text-xs mb-0.5">Secure Payment</h5>
                  <p className="text-gray-500 text-2xs leading-relaxed">Pay the localized consultation fee safely online.</p>
                </div>
                {/* Step 4 */}
                <div className="relative">
                  <span className="absolute -left-[27px] top-0.5 bg-green-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-2xs font-bold ring-4 ring-white">4</span>
                  <h5 className="font-bold text-gray-900 text-xs mb-0.5">Book Live Slot</h5>
                  <p className="text-gray-500 text-2xs leading-relaxed">Pick your exact date and hour on Dr. Arti's live calendar link.</p>
                </div>
                {/* Step 5 */}
                <div className="relative">
                  <span className="absolute -left-[27px] top-0.5 bg-green-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-2xs font-bold ring-4 ring-white">5</span>
                  <h5 className="font-bold text-gray-900 text-xs mb-0.5">Video Consultation</h5>
                  <p className="text-gray-500 text-2xs leading-relaxed">Discuss symptoms, reports, and lifestyle during a private video call.</p>
                </div>
                {/* Step 6 */}
                <div className="relative">
                  <span className="absolute -left-[27px] top-0.5 bg-green-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-2xs font-bold ring-4 ring-white">6</span>
                  <h5 className="font-bold text-gray-900 text-xs mb-0.5">Prescription & Medicine Delivery</h5>
                  <p className="text-gray-500 text-2xs leading-relaxed">Receive a digital copy. Prescribed certified herbs are packed and shipped to your address.</p>
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
                Our team monitors all consultation requests closely. Dr. Arti Singh or her clinic coordinator will contact you within 24 hours (excluding Sundays) via email or WhatsApp to confirm your appointment time and provide the next steps for your Ayurvedic treatment.
              </div>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group cursor-pointer">
              <summary className="font-bold text-lg text-gray-900 list-none flex justify-between items-center outline-none">
                Can Ayurvedic medicines be shipped to my country (USA/UK/UAE/Canada/Australia)?
                <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-600 leading-relaxed font-medium pt-4 border-t border-gray-50">
                Yes, we routinely ship certified, natural Ayurvedic preparations to our international patients in the USA, UK, UAE, Canada, and Australia. Customs clearance, tracking details, and doorstep delivery are fully managed by our international courier partners.
              </div>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group cursor-pointer">
              <summary className="font-bold text-lg text-gray-900 list-none flex justify-between items-center outline-none">
                Can I continue my current allopathic medicines during Ayurvedic treatment?
                <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-600 leading-relaxed font-medium pt-4 border-t border-gray-50">
                Yes. You should never stop any ongoing allopathic medication (such as thyroid hormone tablets or diabetes medicines) without consulting your prescribing doctor. Ayurvedic treatment can be safely integrated alongside them, and we advise maintaining a gap of at least 60 minutes between allopathic and Ayurvedic doses.
              </div>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group cursor-pointer">
              <summary className="font-bold text-lg text-gray-900 list-none flex justify-between items-center outline-none">
                Do I need to stop taking birth control pills or hormonal medication before consulting?
                <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-600 leading-relaxed font-medium pt-4 border-t border-gray-50">
                No, please do not stop any hormonal treatment on your own. During your video consultation, Dr. Arti Singh will evaluate your complete hormone history and cycle rhythm to lay out a safe, gradual, and scientifically backed tapering plan if appropriate.
              </div>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group cursor-pointer">
              <summary className="font-bold text-lg text-gray-900 list-none flex justify-between items-center outline-none">
                What reports should I keep ready before my consultation?
                <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-600 leading-relaxed font-medium pt-4 border-t border-gray-50">
                Please gather any pelvic ultrasound (USG) reports, thyroid panels (TSH, Free T3/T4), blood sugar profiles, or hormone tests (FSH, LH, Prolactin, Testosterone) done in the last 6 months. If you don't have recent tests, Dr. Arti Singh will tell you if any are required during your consultation.
              </div>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group cursor-pointer">
              <summary className="font-bold text-lg text-gray-900 list-none flex justify-between items-center outline-none">
                Where is Dr. Arti Singh's Ayurvedic clinic physically located?
                <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-600 leading-relaxed font-medium pt-4 border-t border-gray-50">
                Ayureva Clinic is located at Road No - 13B, Bahadurpur Gumati, Rajendra Nagar, Patna - 800016, Bihar. However, we serve women globally through our highly effective online video consultation platform.
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
                    "text": "Our team monitors all consultation requests closely. Dr. Arti Singh or her clinic coordinator will contact you within 24 hours (excluding Sundays) via email or WhatsApp to confirm your appointment time and provide the next steps for your Ayurvedic treatment."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can Ayurvedic medicines be shipped to my country (USA/UK/UAE/Canada/Australia)?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we routinely ship certified, natural Ayurvedic preparations to our international patients in the USA, UK, UAE, Canada, and Australia. Customs clearance, tracking details, and doorstep delivery are fully managed by our international courier partners."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I continue my current allopathic medicines during Ayurvedic treatment?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. You should never stop any ongoing allopathic medication (such as thyroid hormone tablets or diabetes medicines) without consulting your prescribing doctor. Ayurvedic treatment can be safely integrated alongside them, and we advise maintaining a gap of at least 60 minutes between allopathic and Ayurvedic doses."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do I need to stop taking birth control pills or hormonal medication before consulting?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No, please do not stop any hormonal treatment on your own. During your video consultation, Dr. Arti Singh will evaluate your complete hormone history and cycle rhythm to lay out a safe, gradual, and scientifically backed tapering plan if appropriate."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What reports should I keep ready before my consultation?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Please gather any pelvic ultrasound (USG) reports, thyroid panels (TSH, Free T3/T4), blood sugar profiles, or hormone tests (FSH, LH, Prolactin, Testosterone) done in the last 6 months. If you don't have recent tests, Dr. Arti Singh will tell you if any are required during your consultation."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Where is Dr. Arti Singh's Ayurvedic clinic physically located?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ayureva Clinic is located at Road No - 13B, Bahadurpur Gumati, Rajendra Nagar, Patna - 800016, Bihar. However, we serve women worldwide through our highly effective online video consultation platform."
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
