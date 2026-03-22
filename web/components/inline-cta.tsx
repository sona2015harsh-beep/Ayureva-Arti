"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Video, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function InlineCTA() {
  return (
    <div className="my-10 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 md:p-8 border border-green-200 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-10">
        <Video className="w-48 h-48 -mt-10 -mr-10 text-green-800" />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Stop Guessing. Start Healing.</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Every woman's Prakriti (body type) is different. Generic advice won't reverse your symptoms. Book a 1-on-1 online video consultation with Dr. Arti Singh for a customized Ayurvedic protocol.
          </p>
          <div className="flex items-center gap-2 text-sm text-green-800 font-semibold bg-green-200/50 w-fit px-3 py-1 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
            </span>
            Accepting New Patients this week
          </div>
        </div>
        
        <div className="w-full md:w-auto flex-shrink-0">
          <Button size="lg" className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white h-14 px-8 text-lg font-bold shadow-lg transition-transform hover:-translate-y-1 rounded-full" asChild>
            <Link href="/contact">
              <Calendar className="w-5 h-5 mr-3" />
              Book Video Consult
            </Link>
          </Button>
          <p className="text-xs text-center text-gray-500 mt-3 font-medium">100% Confidential • Secure Online Call</p>
        </div>
      </div>
    </div>
  )
}
