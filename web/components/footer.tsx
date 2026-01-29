import { Leaf, Mail, MapPin } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Ayureva</h3>
                <p className="text-sm text-gray-400">by Dr. Arti Singh</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Dedicated to providing holistic healthcare solutions through traditional Ayurvedic medicine and modern
              wellness practices.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/services" className="hover:text-green-400">
                  PCOS/PCOD Treatment
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-green-400">
                  Menstrual Health
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-green-400">
                  Diet & Nutrition
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-green-400">
                  Fitness Guidance
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-green-400">
                  Preventive Care
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/about" className="hover:text-green-400">
                  About Dr. Arti
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-green-400">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-green-400">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-green-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-green-400">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-green-400">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>drartisingh1102@gmail.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>
                  Road No - 13B, Bahadurpur Gumati, Rajendra Nagar
                  <br />
                  Patna - 800016
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Ayureva by Dr. Arti Singh. All rights reserved. |
            <span className="text-green-400"> Healing naturally, living healthily</span>
          </p>
          <div className="mt-2 space-x-4 text-xs text-gray-500">
            <Link href="/privacy-policy" className="hover:text-green-400">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-conditions" className="hover:text-green-400">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-green-400">
              Refund Policy
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-green-400">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
