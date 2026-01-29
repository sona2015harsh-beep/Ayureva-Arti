"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { trackPageView, GA_TRACKING_ID } from "@/lib/analytics"
import Script from "next/script"

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Track page views on route changes
    const pageName = pathname === "/" ? "home" : pathname.slice(1)
    trackPageView(pageName)
  }, [pathname])

  return (
    <>
      {/* Google Analytics Scripts */}
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
      {children}
    </>
  )
}
