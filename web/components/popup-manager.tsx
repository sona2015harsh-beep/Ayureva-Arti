"use client"

import { useState, useEffect } from "react"
import ConsultationPopup from "./consultation-popup"

export default function PopupManager() {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    // Clear any existing popup data for testing (remove this in production if needed)
    // localStorage.removeItem("consultation-popup-dismissed")
    // localStorage.removeItem("consultation-popup-last-shown")

    // Check if user has permanently dismissed the popup
    const dismissed = localStorage.getItem("consultation-popup-dismissed")

    if (dismissed === "true") {
      return
    }

    // Check if popup was shown recently (within last 24 hours)
    const lastShown = localStorage.getItem("consultation-popup-last-shown")
    if (lastShown) {
      const lastShownTime = Number.parseInt(lastShown)
      const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000

      if (lastShownTime > twentyFourHoursAgo) {
        return
      }
    }

    // Show popup after 45 seconds
    const initialTimer = setTimeout(() => {
      setShowPopup(true)
      localStorage.setItem("consultation-popup-last-shown", Date.now().toString())
    }, 45000) // 45 seconds

    return () => {
      clearTimeout(initialTimer)
    }
  }, [])

  const handleClose = () => {
    setShowPopup(false)

    // Show again after 24 hours
    setTimeout(
      () => {
        const dismissed = localStorage.getItem("consultation-popup-dismissed")
        if (dismissed !== "true") {
          setShowPopup(true)
          localStorage.setItem("consultation-popup-last-shown", Date.now().toString())
        }
      },
      24 * 60 * 60 * 1000, // 24 hours
    )
  }

  const handleRemindLater = () => {
    setShowPopup(false)

    // Show again after 24 hours
    setTimeout(
      () => {
        const dismissed = localStorage.getItem("consultation-popup-dismissed")
        if (dismissed !== "true") {
          setShowPopup(true)
          localStorage.setItem("consultation-popup-last-shown", Date.now().toString())
        }
      },
      24 * 60 * 60 * 1000, // 24 hours
    )
  }

  const handlePermanentDismiss = () => {
    setShowPopup(false)
    localStorage.setItem("consultation-popup-dismissed", "true")
  }

  // For testing - you can temporarily reduce the timer to 3 seconds
  // Change 10000 to 3000 in the setTimeout above for quick testing

  return (
    <ConsultationPopup
      isOpen={showPopup}
      onClose={handleClose}
      onRemindLater={handleRemindLater}
      onPermanentDismiss={handlePermanentDismiss}
    />
  )
}
