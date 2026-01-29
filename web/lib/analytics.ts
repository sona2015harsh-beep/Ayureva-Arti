// Google Analytics 4 tracking utilities
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    })
  }
}

// Generic event tracking function
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      send_to: GA_TRACKING_ID,
    })
  }

  // Also log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("Analytics Event:", { action, category, label, value })
  }
}

// Specific tracking functions for consultation-related actions
export const trackConsultationClick = (location: string, buttonType = "button") => {
  trackEvent("consultation_click", "engagement", `${location}_${buttonType}`)
}

export const trackPhoneClick = (location: string) => {
  trackEvent("phone_click", "contact", location)
}

export const trackEmailClick = (location: string) => {
  trackEvent("email_click", "contact", location)
}

export const trackFormSubmission = (formType: string, success: boolean) => {
  trackEvent("form_submission", "conversion", `${formType}_${success ? "success" : "error"}`)
}

export const trackPageView = (pageName: string) => {
  trackEvent("page_view", "navigation", pageName)
}

export const trackServiceInterest = (serviceName: string) => {
  trackEvent("service_interest", "engagement", serviceName)
}

export const trackTestimonialView = (testimonialId: string) => {
  trackEvent("testimonial_view", "engagement", testimonialId)
}

// Custom hook for analytics
export const useAnalytics = () => {
  return {
    trackConsultationClick,
    trackPhoneClick,
    trackEmailClick,
    trackFormSubmission,
    trackPageView,
    trackServiceInterest,
    trackTestimonialView,
    trackEvent,
  }
}
