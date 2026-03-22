"use client"

import { MessageCircle } from "lucide-react"

export default function WhatsAppCTA() {
  const phoneNumber = "919472351102" // Dr. Arti's WhatsApp (India +91)
  const message = encodeURIComponent(
    "Hi Dr. Arti, I found Ayureva online and I'd like to book a video consultation for PCOD/PCOS treatment. Can you share the details?"
  )

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all hover:scale-105 group"
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
    </a>
  )
}
