import type { Metadata } from "next"

import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Terms & Conditions - Ayureva by Dr. Arti Singh | Service Terms",
  description:
    "Terms and Conditions for Ayureva Ayurvedic services. Understand our service terms, consultation policies, and patient responsibilities.",
  keywords: ["terms conditions", "service terms", "consultation policy", "Ayureva", "Dr. Arti Singh"],
  alternates: {
    canonical: "/terms-conditions",
  },
}

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">


      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">Legal Information</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
            <p className="text-lg text-gray-600">
              Please read these terms carefully before using our services
            </p>
            <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using the services provided by Ayureva and Dr. Arti Singh (BAMS), you accept and agree
                to be bound by the terms and provision of this agreement. If you do not agree to abide by the above,
                please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Ayureva provides Ayurvedic healthcare services including but not limited to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Ayurvedic consultations (in-person and online)</li>
                  <li>Treatment for PCOS, PCOD, and menstrual disorders</li>
                  <li>Women's health and wellness services</li>
                  <li>Nutritional and lifestyle counseling</li>
                  <li>Preventive healthcare guidance</li>
                  <li>Follow-up consultations and monitoring</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Professional Qualifications</h2>
              <p className="text-gray-600 leading-relaxed">
                Dr. Arti Singh is a qualified BAMS (Bachelor of Ayurvedic Medicine and Surgery) practitioner with
                clinical training from recognized institutions. All treatments and advice are provided within the scope
                of Ayurvedic medicine and traditional healing practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Patient Responsibilities</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">4.1 Information Accuracy</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Provide accurate and complete medical history</li>
                  <li>Disclose all current medications and treatments</li>
                  <li>Report any allergies or adverse reactions</li>
                  <li>Update us about changes in your health condition</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">4.2 Treatment Compliance</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Follow prescribed treatment plans and recommendations</li>
                  <li>Attend scheduled follow-up appointments</li>
                  <li>Inform us of any concerns or side effects</li>
                  <li>Maintain regular communication during treatment</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Consultation Policies</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">5.1 Appointment Scheduling</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Appointments must be scheduled in advance</li>
                  <li>Confirmation will be provided via phone or email</li>
                  <li>Please arrive 10 minutes early for in-person consultations</li>
                  <li>Online consultations require stable internet connection</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">5.2 Cancellation Policy</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Cancellations must be made at least 24 hours in advance</li>
                  <li>Emergency cancellations will be considered case by case</li>
                  <li>No-shows may be charged a consultation fee</li>
                  <li>Rescheduling is subject to availability</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Treatment Limitations</h2>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Important Medical Disclaimers:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Ayurvedic treatment is complementary and may be used alongside conventional medicine</li>
                  <li>Results may vary from person to person based on individual constitution and condition</li>
                  <li>We do not claim to cure all diseases or guarantee specific outcomes</li>
                  <li>Emergency medical conditions require immediate conventional medical attention</li>
                  <li>Pregnant women should inform us before starting any treatment</li>
                  <li>Children's treatments require parental consent and supervision</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Payment Terms</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">7.1 Consultation Fees</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Consultation fees are due at the time of service</li>
                  <li>We accept cash, UPI, and online payments</li>
                  <li>Payment plans may be available for extended treatments</li>
                  <li>Fees are subject to change with prior notice</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">7.2 Refund Policy</h3>
                <p className="text-gray-600">
                  Please refer to our separate Refund & Cancellation Policy for detailed information about refunds,
                  cancellations, and payment disputes.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Confidentiality</h2>
              <p className="text-gray-600 leading-relaxed">
                We maintain strict confidentiality of all patient information in accordance with medical ethics and
                applicable privacy laws. Patient information will not be shared without explicit consent except as
                required by law or in medical emergencies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <div className="bg-red-50 p-6 rounded-lg">
                <p className="text-gray-600 leading-relaxed">
                  While we strive to provide the best possible care, Ayureva and Dr. Arti Singh shall not be liable for
                  any indirect, incidental, special, consequential, or punitive damages arising from the use of our
                  services. Our liability is limited to the amount paid for the specific service in question.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed">
                All content on our website, including text, graphics, logos, and treatment protocols, is the property of
                Ayureva and Dr. Arti Singh. Unauthorized use, reproduction, or distribution is prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These terms and conditions are governed by the laws of India. Any disputes arising from these terms or
                our services shall be subject to the jurisdiction of the courts in Patna, Bihar.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify these terms and conditions at any time. Changes will be posted on our
                website with an updated effective date. Continued use of our services after changes constitutes
                acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">
                  For questions about these Terms & Conditions, please contact us:
                </p>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Dr. Arti Singh</strong></p>
                  <p><strong>Email:</strong> drartisingh1102@gmail.com</p>
                  <p><strong>Phone:</strong> +91 9709968077</p>
                  <p><strong>Address:</strong> Road No - 13B, Bahadurpur Gumati, Rajendra Nagar, Patna - 800016</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>


    </div>
  )
}
