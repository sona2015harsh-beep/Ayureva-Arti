"use client"

interface DiseaseSchemaProps {
  disease: "pcos" | "thyroid" | "ibs"
  country?: "usa" | "uk" | "canada" | "uae" | "australia"
}

export default function DiseaseSchema({ disease, country }: DiseaseSchemaProps) {
  const baseUrl = "https://www.ayureva.in"
  
  // 1. Resolve country names & path structure
  const countryNames = {
    usa: "United States (USA)",
    uk: "United Kingdom (UK)",
    canada: "Canada",
    uae: "United Arab Emirates (UAE)",
    australia: "Australia"
  }

  const diseaseSlugs = {
    pcos: "ayurvedic-pcos-treatment",
    thyroid: "ayurvedic-thyroid-treatment",
    ibs: "ayurvedic-ibs-bloating-treatment"
  }

  const diseaseNames = {
    pcos: "PCOS & Hormonal Health",
    thyroid: "Thyroid & Metabolism Support",
    ibs: "IBS & Gut Health (Bloating)"
  }

  const slug = diseaseSlugs[disease]
  const diseaseName = diseaseNames[disease]
  const countryName = country ? countryNames[country] : ""
  
  const pageUrl = country ? `${baseUrl}/${slug}/${country}` : `${baseUrl}/${slug}`
  const parentUrl = `${baseUrl}/${slug}`

  // 2. Localized FAQs
  const faqs = [
    {
      q: "Can I consult from outside India?",
      a: "Yes, Dr. Arti Singh conducts video consultations for international patients worldwide. All sessions are done via a secure Google Meet video link."
    },
    {
      q: "How does the online consultation work?",
      a: "Once you submit the intake form and complete the payment, you will receive a booking link to choose a convenient time slot. During the video call, Dr. Arti will analyze your symptoms and medical history in detail."
    },
    {
      q: "How do I receive my treatment plan?",
      a: "Within 24 hours of your consultation, a personalized treatment plan—including herbal prescriptions, dietary guidelines, and lifestyle changes—will be emailed to you."
    },
    {
      q: "How long does the consultation last?",
      a: "Each initial consultation lasts between 45 to 60 minutes, ensuring enough time to discuss your health history, current complaints, and lifestyle."
    },
    {
      q: "What if I don't have previous medical reports?",
      a: "You do not need to prepare anything special. Even if you do not have previous blood tests or reports, we can still begin the consultation by analyzing your history and symptoms."
    }
  ]

  // 3. Construct JSON-LD Schema Graph
  const graph: any[] = [
    // A. Organization Schema
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "Ayureva",
      "url": baseUrl,
      "logo": `${baseUrl}/logo.png`,
      "sameAs": [
        "https://www.instagram.com/ayureva.in"
      ]
    },
    // B. Breadcrumb Schema
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": diseaseName,
          "item": parentUrl
        },
        ...(country ? [{
          "@type": "ListItem",
          "position": 3,
          "name": countryName,
          "item": pageUrl
        }] : [])
      ]
    },
    // C. Physician Schema (Dr. Arti Singh)
    {
      "@context": "https://schema.org",
      "@type": "Physician",
      "@id": `${baseUrl}/doctor/dr-arti-singh#physician`,
      "name": "Dr. Arti Singh",
      "image": `${baseUrl}/images/dr-arti-singh.jpg`,
      "telephone": "+91-help-ayureva",
      "email": "help@ayureva.in",
      "url": `${baseUrl}/doctor/dr-arti-singh`,
      "medicalSpecialty": disease === "pcos" ? "Gynecologic" : disease === "thyroid" ? "Endocrine" : "Gastroenterologic",
      "description": "Dr. Arti Singh (B.A.M.S.) is a registered Ayurvedic physician specializing in women's health, hormonal disorders, thyroid management, and metabolic recovery.",
      "credential": [
        {
          "@type": "EducationalOccupationalCredential",
          "credentialCategory": "degree",
          "name": "Bachelor of Ayurvedic Medicine and Surgery (B.A.M.S.)"
        }
      ],
      "knowsAbout": ["Ayurveda", "PCOS", "Hypothyroidism", "IBS", "Women's Health"],
      "affiliation": {
        "@type": "MedicalClinic",
        "name": "Ayureva Clinic",
        "url": baseUrl,
        "parentOrganization": {
          "@id": `${baseUrl}/#organization`
        }
      }
    },
    // D. MedicalWebPage Schema
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "@id": `${pageUrl}#webpage`,
      "url": pageUrl,
      "name": country 
        ? `Online Ayurvedic ${diseaseName} Consultation for Patients in ${countryName}` 
        : `Ayurvedic ${diseaseName} Treatment Online`,
      "description": `Book a private online video consultation with Dr. Arti Singh (B.A.M.S.) for natural Ayurvedic ${diseaseName.toLowerCase()} management.`,
      "aspect": "prevention and natural management",
      "specialty": "Ayurveda",
      "reviewedBy": {
        "@type": "Physician",
        "name": "Dr. Arti Singh",
        "url": `${baseUrl}/doctor/dr-arti-singh`
      },
      "audience": {
        "@type": "PeopleAudience",
        "suggestedGender": "female",
        "audienceType": `${diseaseName} Patients`
      }
    },
    // E. FAQ Schema
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    }
  ]

  // Inject dynamic script block containing combined schema graph
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
