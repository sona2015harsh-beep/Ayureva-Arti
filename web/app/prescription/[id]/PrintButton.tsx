'use client'

import { Printer } from 'lucide-react'

interface PrintButtonProps {
  className?: string;
  label?: string;
  variant?: 'floating' | 'header';
}

export default function PrintButton({ className, label = "Print / Save PDF", variant = 'header' }: PrintButtonProps) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  if (variant === 'floating') {
    return (
      <button 
        onClick={handlePrint}
        className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer border-none"
      >
        <Printer className="w-4 h-4" /> {label}
      </button>
    )
  }

  return (
    <button 
      onClick={handlePrint}
      className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-all cursor-pointer border-none font-bold"
    >
      <Printer className="w-3.5 h-3.5" /> {label}
    </button>
  )
}
