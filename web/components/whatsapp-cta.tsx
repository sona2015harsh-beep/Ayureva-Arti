"use client"

import { MessageCircle } from "lucide-react"

export default function WhatsAppCTA() {
  const handleChat = (e: React.MouseEvent) => {
    e.preventDefault()
    // Obfuscate phone parts to prevent scrapers from extracting the number
    const cCode = "91"
    const prefix = "9608"
    const suffix = "855210"
    const phone = `${cCode}${prefix}${suffix}`
    const text = encodeURIComponent(
      "Hi Dr. Arti, I found Ayureva online and I'd like to book a video consultation for PCOD/PCOS treatment. Can you share the details?"
    )
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${text}`, "_blank", "noopener,noreferrer")
  }

  return (
    <button
      onClick={handleChat}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all hover:scale-105 group border-none cursor-pointer"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white" />
      <span className="hidden sm:inline font-semibold text-sm">
        WhatsApp Us
      </span>
      
      {/* Ping animation */}
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-400"></span>
      </span>
    </button>
  )
}
