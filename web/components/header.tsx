"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import Link from "next/link"
import NextImage from "next/image"
import { usePathname } from "next/navigation"
import MobileMenu from "./mobile-menu"
import { useAnalytics } from "@/lib/analytics"

export default function Header() {
  const pathname = usePathname()
  const { trackConsultationClick } = useAnalytics()

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    if (pathname === href) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleConsultationClick = () => {
    trackConsultationClick("header", "primary_cta")
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-12 h-12">
              <NextImage
                src="/icon.png"
                alt="Ayureva Logo"
                fill
                className="object-contain"
                sizes="48px"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ayureva</h1>
              <p className="text-sm text-green-600 font-medium">by Dr. Arti Singh</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={(e) => handleNavClick("/", e)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={(e) => handleNavClick("/about", e)}
              >
                About
              </Link>
              <Link
                href="/services"
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={(e) => handleNavClick("/services", e)}
              >
                Treatments
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={(e) => handleNavClick("/blog", e)}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={(e) => handleNavClick("/contact", e)}
              >
                Contact
              </Link>
            </nav>

            <Link href="/contact" onClick={handleConsultationClick}>
              <Button className="bg-green-600 hover:bg-green-700">
                <Calendar className="w-4 h-4 mr-2" />
                Book Consultation
              </Button>
            </Link>
          </div>

          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
