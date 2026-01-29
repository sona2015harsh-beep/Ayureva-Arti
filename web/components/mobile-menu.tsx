"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useAnalytics } from "@/lib/analytics"

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { trackConsultationClick } = useAnalytics()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    if (pathname === href) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    closeMenu()
  }

  const handleConsultationClick = () => {
    trackConsultationClick("mobile_menu", "primary_cta")
    closeMenu()
  }

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="sm" onClick={toggleMenu} className="p-2">
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t z-50">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors py-2"
              onClick={(e) => handleNavClick("/", e)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors py-2"
              onClick={(e) => handleNavClick("/about", e)}
            >
              About
            </Link>
            <Link
              href="/services"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors py-2"
              onClick={(e) => handleNavClick("/services", e)}
            >
              Treatments
            </Link>
            <Link
              href="/blog"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors py-2"
              onClick={(e) => handleNavClick("/blog", e)}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors py-2"
              onClick={(e) => handleNavClick("/contact", e)}
            >
              Contact
            </Link>
            <Link href="/contact" className="mt-4" onClick={handleConsultationClick}>
              <Button className="w-full bg-green-600 hover:bg-green-700">Book Consultation</Button>
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}
