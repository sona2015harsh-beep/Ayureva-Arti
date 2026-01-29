import type { Metadata } from "next"

import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Privacy Policy - Ayureva by Dr. Arti Singh | Patient Data Protection",
  description:
    "Privacy Policy for Ayureva clinic. Learn how we protect your personal health information and maintain patient confidentiality in our Ayurvedic practice.",
  keywords: ["privacy policy", "patient confidentiality", "data protection", "Ayureva", "Dr. Arti Singh"],
  alternates: {
    canonical: "/privacy-policy",
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">


      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">Legal Information</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">
              Your privacy and confidentiality are our top priorities at Ayureva
            </p>
            <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                Ayureva, operated by Dr. Arti Singh (BAMS), is committed to protecting your privacy and maintaining the
                confidentiality of your personal health information. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our website, use our services, or engage in
                consultations with us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">2.1 Personal Information</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Name, email address, phone number</li>
                    <li>Date of birth, gender, address</li>
                    <li>Medical history and health concerns</li>
                    <li>Consultation notes and treatment records</li>
                    <li>Payment information (processed securely through third-party providers)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">2.2 Technical Information</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>IP address, browser type, device information</li>
                    <li>Website usage data and analytics</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Provide Ayurvedic consultations and treatment services</li>
                <li>Maintain accurate medical records and treatment history</li>
                <li>Communicate about appointments, treatments, and follow-ups</li>
                <li>Process payments and manage billing</li>
                <li>Improve our services and website functionality</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Send important updates about our services (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information
                only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or court orders</li>
                <li>With healthcare professionals involved in your treatment (with your consent)</li>
                <li>With trusted service providers who assist in our operations (under strict confidentiality agreements)</li>
                <li>In case of medical emergencies where disclosure is necessary for your safety</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>SSL encryption for data transmission</li>
                <li>Secure servers and databases</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information on a need-to-know basis</li>
                <li>Staff training on privacy and confidentiality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-600 mb-4">
                We retain your personal information only for as long as necessary to provide you with our services and as
                required by applicable laws:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Medical records are retained in compliance with Indian medical regulations (typically 3-5 years)</li>
                <li>Transactional records are kept for 7 years for tax and accounting purposes</li>
                <li>Marketing preferences are retained until you opt-out or withdraw consent</li>
                <li>Inactive user accounts may be deleted after 24 months of inactivity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="text-gray-600 mb-4">You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Access: Request copies of your personal information</li>
                <li>Rectification: Request correction of inaccurate information</li>
                <li>Erasure: Request deletion of your personal information (subject to legal requirements)</li>
                <li>Portability: Request transfer of your information to another provider</li>
                <li>Objection: Object to processing of your personal information</li>
                <li>Withdraw consent: Withdraw consent for marketing communications</li>
                <li>
                  Lodge a complaint: You have the right to lodge a complaint with a supervisory authority if you believe your
                  rights have been violated
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies and Tracking</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar technologies to enhance your website experience:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Essential cookies for website functionality</li>
                <li>Analytics cookies to understand website usage</li>
                <li>Marketing cookies (with your consent)</li>
              </ul>
              <p className="text-gray-600 mt-4">
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Patients</h2>
              <p className="text-gray-600">
                For international patients, we comply with applicable data protection laws including GDPR. Your
                information may be transferred and processed in India, where our practice is located. We ensure
                appropriate safeguards are in place for international data transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-600">
                We do not knowingly collect personal information from children under 18 without parental consent. If
                you are a parent or guardian and believe your child has provided us with personal information, please
                contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by
                posting the new policy on our website and updating the "Last updated" date. Your continued use of our
                services after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
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
