"use client"

import { useEffect } from "react"

export default function SmoothScroll() {
  useEffect(() => {
    // Add smooth scrolling behavior to the document
    document.documentElement.style.scrollBehavior = "smooth"

    // Handle hash links for smooth scrolling
    const handleHashClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement
      if (target.hash) {
        e.preventDefault()
        const element = document.querySelector(target.hash)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }
    }

    // Add event listeners to all hash links
    const hashLinks = document.querySelectorAll('a[href^="#"]')
    hashLinks.forEach((link) => {
      link.addEventListener("click", handleHashClick)
    })

    // Cleanup
    return () => {
      hashLinks.forEach((link) => {
        link.removeEventListener("click", handleHashClick)
      })
    }
  }, [])

  return null
}
