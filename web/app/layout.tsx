import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import SmoothScroll from "@/components/smooth-scroll"
import ScrollToTop from "@/components/scroll-to-top"
import AnalyticsProvider from "@/components/analytics-provider"
import PopupManager from "@/components/popup-manager"
import WhatsAppCTA from "@/components/whatsapp-cta"
import { Suspense } from "react"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ayureva.in"),
  title: "Ayureva - Best Ayurvedic Doctor India | Online Consultation for PCOS & Women's Health",
  description:
    "Leading Ayurvedic specialist Dr. Arti Singh offering world-class online consultation for PCOS, infertility, and hormonal treatment. Serving patients in India, USA, UK, UAE & Worldwide.",
  keywords: [
    "Ayureva",
    "Best Ayurvedic Doctor India",
    "Online Ayurvedic Consultation",
    "Ayurvedic Doctor for PCOS",
    "International Ayurveda Specialist",
    "Ayurveda Consultation USA",
    "Ayurveda Consultation UK",
    "Natural PCOS Treatment Online",
    "Ayurvedic Infertility Treatment",
    "Dr. Arti Singh Ayurveda",
    "Women's Health Specialist Ayurveda",
    "Online Doctor for PCOD",
    "Ayureva Global",
    "Holistic Health Consultation",
    "Ayurvedic Gynecologist Online",
  ],
  authors: [{ name: "Dr. Arti Singh", url: "https://www.ayureva.in" }],
  creator: "Ayureva by Dr. Arti Singh",
  publisher: "Ayureva",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.ayureva.in",
    siteName: "Ayureva - Best Ayurveda Treatment by Dr. Arti Singh",
    title: "Ayureva - Best Ayurveda Treatment | PCOS PCOD UTI Treatment Specialist",
    description:
      "Ayureva by Dr. Arti Singh - Leading Ayurveda treatment specialist offering natural PCOS treatment, PCOD treatment, UTI treatment, menstrual disorders, fertility treatment. Visit Ayureva.in today!",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Ayureva - Ayurvedic Medical Clinic",
      },
      {
        url: "/dr-arti-singh.jpg",
        width: 800,
        height: 800,
        alt: "Dr. Arti Singh - Ayurvedic Specialist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayureva - Best Ayurveda Treatment | PCOS PCOD UTI Treatment Specialist",
    description:
      "Ayureva by Dr. Arti Singh - Leading Ayurveda treatment specialist offering natural PCOS treatment, PCOD treatment, UTI treatment, menstrual disorders, fertility treatment.",
    images: ["/ayurvedic-doctor.png"],
    site: "@Ayureva",
    creator: "@DrArtiSingh",
  },

  verification: {
    google: "50km3b9GB7jhBuhQC0SnBvIp7g5AyTuzj1jsPRcy1Ls",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  category: "Healthcare",
  other: {
    brand: "Ayureva",
    "clinic-name": "Ayureva",
    "doctor-name": "Dr. Arti Singh",
    specialty: "Ayurveda Treatment Women's Health",
    treatments: "PCOS treatment, PCOD treatment, UTI treatment, fertility treatment, thyroid treatment",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Ayureva",
  alternateName: ["Ayureva Clinic", "Ayureva by Dr. Arti Singh", "Ayureva.in", "Ayurveda Treatment Center"],
  description:
    "Ayureva - Leading Ayurveda treatment clinic by Dr. Arti Singh offering natural PCOS treatment, PCOD treatment, UTI treatment, menstrual disorders treatment, fertility treatment, thyroid treatment, and comprehensive women's health solutions",
  url: "https://www.ayureva.in",
  sameAs: ["https://www.ayureva.in"],
  telephone: "+919709968077",
  email: "drartisingh1102@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Road No - 13B, Bahadurpur Gumati, Rajendra Nagar",
    addressLocality: "Patna",
    addressRegion: "Bihar",
    postalCode: "800016",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "25.5941",
    longitude: "85.1376",
  },
  openingHours: ["Mo-Fr 09:00-18:00", "Sa 09:00-14:00"],
  priceRange: "$$",
  image: "https://www.ayureva.in/ayurvedic-doctor.png",
  logo: "https://www.ayureva.in/placeholder-logo.png",
  founder: {
    "@type": "Person",
    name: "Dr. Arti Singh",
    jobTitle: "Ayurveda Treatment Specialist",
    description:
      "BAMS qualified Ayurveda doctor specializing in PCOS treatment, PCOD treatment, UTI treatment, women's health and hormonal disorders at Ayureva",
    worksFor: {
      "@type": "Organization",
      name: "Ayureva",
    },
  },
  medicalSpecialty: [
    "Ayurveda Treatment",
    "PCOS Treatment",
    "PCOD Treatment",
    "UTI Treatment",
    "Women's Health",
    "Reproductive Health",
    "Hormonal Disorders Treatment",
    "Menstrual Disorders Treatment",
    "Fertility Treatment",
    "Thyroid Treatment",
    "Endometriosis Treatment",
    "Menopause Treatment",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Ayureva Ayurveda Treatments",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "MedicalTherapy",
          name: "PCOS Treatment at Ayureva",
          description: "Natural Ayurveda PCOS treatment for polycystic ovary syndrome at Ayureva clinic",
          provider: {
            "@type": "Organization",
            name: "Ayureva",
          },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "MedicalTherapy",
          name: "PCOD Treatment at Ayureva",
          description: "Holistic Ayurveda PCOD treatment for polycystic ovarian disease at Ayureva",
          provider: {
            "@type": "Organization",
            name: "Ayureva",
          },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "MedicalTherapy",
          name: "UTI Treatment at Ayureva",
          description: "Natural Ayurveda UTI treatment for urinary tract infections at Ayureva clinic",
          provider: {
            "@type": "Organization",
            name: "Ayureva",
          },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "MedicalTherapy",
          name: "Menstrual Disorders Treatment at Ayureva",
          description: "Comprehensive Ayurveda treatment for irregular periods and menstrual problems at Ayureva",
          provider: {
            "@type": "Organization",
            name: "Ayureva",
          },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "MedicalTherapy",
          name: "Fertility Treatment at Ayureva",
          description: "Natural Ayurveda fertility treatment and reproductive health support at Ayureva",
          provider: {
            "@type": "Organization",
            name: "Ayureva",
          },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "MedicalTherapy",
          name: "Thyroid Treatment at Ayureva",
          description: "Holistic Ayurveda thyroid treatment for hypothyroidism and hyperthyroidism at Ayureva",
          provider: {
            "@type": "Organization",
            name: "Ayureva",
          },
        },
      },
    ],
  },
  brand: {
    "@type": "Brand",
    name: "Ayureva",
    description: "Leading Ayurveda treatment clinic for women's health",
  },
  parentOrganization: {
    "@type": "Organization",
    name: "Ayureva Healthcare",
    url: "https://www.ayureva.in",
  },
  mainEntity: {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can Ayurveda cure PCOS naturally?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Ayurveda treats the root cause of PCOS by balancing hormones (Doshas), improving metabolism, and regulating menstrual cycles through natural herbs and Panchakarma therapies without side effects.",
        },
      },
      {
        "@type": "Question",
        name: "Who is the best Ayurvedic doctor for women in Patna?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Dr. Arti Singh (BAMS) at Ayureva is a leading women's health specialist in Patna, offering expert treatment for PCOS, PCOD, infertility, and menstrual disorders with high success rates.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer online Ayurvedic consultation for international patients?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we specialize in treating international patients from USA, UK, UAE, Canada, and Australia via secure video consultations. We provide detailed diet charts and lifestyle guidance suitable for your local climate and lifestyle.",
        },
      },
      {
        "@type": "Question",
        name: "Is Ayurvedic treatment safe for fertility issues?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. Ayurveda offers safe, non-invasive fertility treatments that prepare the body for conception by detoxifying the reproductive system and strengthening reproductive tissues.",
        },
      },
    ],
  },
}

import Header from "@/components/header"
import Footer from "@/components/footer"

// ... imports remain the same

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <meta name="brand" content="Ayureva" />
        <meta name="clinic" content="Ayureva" />
        <meta name="business-name" content="Ayureva" />
        <meta name="organization" content="Ayureva by Dr. Arti Singh" />
        <meta
          name="treatments"
          content="PCOS treatment, PCOD treatment, UTI treatment, fertility treatment, thyroid treatment, menstrual disorders treatment"
        />
        <meta name="specialty" content="Ayurveda treatment, women's health, hormonal disorders" />



        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1200907614877581"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Suspense fallback={null}>
          <AnalyticsProvider>
            <SmoothScroll />
            <ScrollToTop />
            <Header />
            {children}
            <Footer />
            <WhatsAppCTA />
          </AnalyticsProvider>
        </Suspense>
      </body>
    </html>
  )
}
