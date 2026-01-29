import type { Metadata } from "next"

import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy - Ayureva by Dr. Arti Singh | Payment Terms",
  description:
    "Refund and Cancellation Policy for Ayureva Ayurvedic services. Learn about our payment terms, refund conditions, and cancellation procedures.",
  keywords: ["refund policy", "cancellation policy", "payment terms", "Ayureva", "Dr. Arti Singh"],
  alternates: {
    canonical: "/refund-policy",
  },
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">


      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">Payment Policy</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund & Cancellation Policy</h1>
            <p className="text-lg text-gray-600">
              Transparent policies for payments, refunds, and cancellations
            </p>
            <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Payment Policy</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">1.1 Accepted Payment Methods</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Cash payments (for in-person consultations)</li>
                  <li>UPI payments (PhonePe, Google Pay, Paytm)</li>
                  <li>Online bank transfers (NEFT/RTGS)</li>
                  <li>Credit/Debit cards (through secure payment gateway)</li>
                  <li>Digital wallets</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">1.2 Payment Terms</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Consultation fees are due at the time of booking or service</li>
                  <li>Treatment packages require advance payment</li>
                  <li>Follow-up consultations are charged separately unless included in package</li>
                  <li>All payments are processed securely through encrypted channels</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Consultation Cancellation Policy</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">2.1 Patient-Initiated Cancellations</h3>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li><strong>24+ hours before appointment:</strong> Full refund or free rescheduling</li>
                    <li><strong>12-24 hours before appointment:</strong> 50% refund or rescheduling with ₹100 fee</li>
                    <li><strong>Less than 12 hours:</strong> No refund, rescheduling subject to ₹200 fee</li>
                    <li><strong>No-show:</strong> Full consultation fee charged, no refund</li>
                  </ul>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">2.2 Doctor-Initiated Cancellations</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Full refund provided immediately</li>
                  <li>Priority rescheduling at patient's convenience</li>
                  <li>Compensation for any inconvenience caused</li>
                  <li>Alternative consultation options offered</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">2.3 Emergency Cancellations</h3>
                <p className="text-gray-600">
                  Medical emergencies, natural disasters, or other unforeseen circumstances will be handled on a
                  case-by-case basis with full consideration for patient welfare.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Treatment Package Refunds</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">3.1 Before Treatment Commencement</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Full refund available up to 48 hours after payment</li>
                  <li>Administrative fee of ₹500 may apply for processing</li>
                  <li>Refund processed within 7-10 business days</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">3.2 After Treatment Commencement</h3>
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li><strong>Within first week:</strong> 80% refund of unused portion</li>
                    <li><strong>Within first month:</strong> 60% refund of unused portion</li>
                    <li><strong>After one month:</strong> 40% refund of unused portion</li>
                    <li><strong>After 50% completion:</strong> No refund available</li>
                  </ul>
                </div>

                <h3 className="text-lg font-semibold text-gray-800">3.3 Medical Reasons for Discontinuation</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Adverse reactions or allergies: Full refund of unused portion</li>
                  <li>Pregnancy (if treatment not suitable): 90% refund of unused portion</li>
                  <li>Other medical conditions: Case-by-case evaluation</li>
                  <li>Doctor's recommendation to discontinue: Full refund of unused portion</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Online Consultation Refunds</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">4.1 Technical Issues</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Connection problems from our end: Full refund or free rescheduling</li>
                  <li>Patient's technical issues: Rescheduling offered, no refund</li>
                  <li>Platform downtime: Full refund and priority rescheduling</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">4.2 Consultation Quality</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Unsatisfactory consultation: Case review and potential refund</li>
                  <li>Incomplete consultation due to time constraints: Partial refund or free follow-up</li>
                  <li>Miscommunication issues: Free follow-up consultation</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Refund Process</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">5.1 How to Request a Refund</h3>
                <ol className="list-decimal list-inside text-gray-600 space-y-1">
                  <li>Contact us via phone (+91 9709968077) or email (drartisingh1102@gmail.com)</li>
                  <li>Provide your booking reference number and reason for refund</li>
                  <li>Submit any supporting documentation if required</li>
                  <li>Await confirmation and processing timeline</li>
                </ol>

                <h3 className="text-lg font-semibold text-gray-800">5.2 Processing Timeline</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>UPI/Digital Wallet refunds: 1-3 business days</li>
                  <li>Bank transfer refunds: 5-7 business days</li>
                  <li>Credit/Debit card refunds: 7-14 business days</li>
                  <li>Complex cases may take up to 21 business days</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">5.3 Refund Method</h3>
                <p className="text-gray-600">
                  Refunds will be processed through the same payment method used for the original transaction. In case
                  of technical issues, alternative refund methods may be arranged.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Non-Refundable Items</h2>
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">The following are non-refundable:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Completed consultations and treatments</li>
                  <li>Herbal medicines and supplements (unless defective)</li>
                  <li>Digital content and treatment plans already delivered</li>
                  <li>Administrative and processing fees</li>
                  <li>Third-party service charges</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Dispute Resolution</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">7.1 Internal Resolution</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Direct communication with Dr. Arti Singh or clinic staff</li>
                  <li>Written complaint review within 48 hours</li>
                  <li>Mediation and mutually acceptable solutions</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800">7.2 External Resolution</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Consumer court proceedings as per Indian Consumer Protection Act</li>
                  <li>Medical council complaints for professional conduct issues</li>
                  <li>Banking ombudsman for payment-related disputes</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Special Circumstances</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">8.1 Force Majeure</h3>
                <p className="text-gray-600">
                  In case of natural disasters, pandemics, government restrictions, or other uncontrollable events,
                  refund and cancellation policies may be modified to ensure fairness to all parties.
                </p>

                <h3 className="text-lg font-semibold text-gray-800">8.2 Seasonal Adjustments</h3>
                <p className="text-gray-600">
                  During peak seasons or special circumstances, modified cancellation policies may apply with prior
                  notice to patients.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">
                  For refund requests, cancellations, or policy questions, contact us:
                </p>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Dr. Arti Singh</strong></p>
                  <p><strong>Email:</strong> drartisingh1102@gmail.com</p>
                  <p><strong>Phone:</strong> +91 9709968077</p>
                  <p><strong>Address:</strong> Road No - 13B, Bahadurpur Gumati, Rajendra Nagar, Patna - 800016</p>
                  <p><strong>Business Hours:</strong> Monday-Friday: 9 AM - 6 PM, Saturday: 9 AM - 2 PM</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Policy Updates</h2>
              <p className="text-gray-600 leading-relaxed">
                This refund and cancellation policy may be updated from time to time. Changes will be communicated to
                existing patients and posted on our website. The updated policy will apply to all future transactions.
              </p>
            </section>
          </div>
        </div>
      </section>


    </div>
  )
}
