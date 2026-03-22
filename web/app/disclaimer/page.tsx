import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Disclaimer | Ayureva",
  description: "Medical and general disclaimer for Ayureva.in and Dr. Arti Singh's Ayurvedic consultations.",
  alternates: {
    canonical: "/disclaimer",
  },
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">Disclaimer</h1>
          
          <div className="prose prose-green max-w-none text-gray-700">
            <p className="lead text-lg font-medium text-gray-800">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Medical Disclaimer</h2>
            <p>
              The information provided on Ayureva.in (the "Website"), including but not limited to articles, blog posts, consultation advice, text, graphics, images, and other material, is for educational and informational purposes only. It is not intended as a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p>
              Always seek the advice of your physician or other qualified healthcare provider regarding any medical condition or treatment. Never disregard professional medical advice or delay in seeking it because of something you have read on this Website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Ayurvedic Treatments & Outcomes</h2>
            <p>
              Ayurveda is a traditional system of medicine that focuses on holistic healing and addressing the root cause of imbalances. Results from Ayurvedic treatments, dietary changes, lifestyle modifications, and herbal supplements vary significantly from person to person.
            </p>
            <p>
              Testimonials, examples, and success stories featured on this Website are experiences of specific individuals and do not guarantee, warranty, or predict that any other individual will achieve similar results. Healing timelines depend on various factors including Prakriti (body constitution), severity of the condition, age, and adherence to prescribed guidelines.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Online Consultations</h2>
            <p>
              Online consultations provided by Dr. Arti Singh (BAMS) are conducted based on the information, symptoms, and medical history provided by the patient. While every effort is made to provide accurate assessments, an online consultation has clinical limitations compared to an in-person physical examination. In cases of medical emergencies, please visit your nearest hospital immediately.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Herbal Products & Medicines</h2>
            <p>
              Any herbal formulations or Ayurvedic medicines prescribed or mentioned on this Website should be taken strictly under the guidance of a qualified Ayurvedic physician. Do not self-medicate or alter the recommended dosage. Certain herbs may interact with allopathic medications; please disclose all active medications during your consultation.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Third-Party Links & Content</h2>
            <p>
              This Website may contain links to third-party web sites or services that are not owned or controlled by Ayureva. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites.
            </p>

            <div className="mt-12 bg-green-50 p-6 rounded-xl border border-green-100">
              <h3 className="text-xl font-bold text-green-900 mb-2">Contact Us</h3>
              <p className="text-green-800">
                If you have any questions about this Disclaimer, please contact us at:
                <br />
                <a href="mailto:drartisingh1102@gmail.com" className="font-semibold hover:text-green-600 hover:underline">
                  drartisingh1102@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
