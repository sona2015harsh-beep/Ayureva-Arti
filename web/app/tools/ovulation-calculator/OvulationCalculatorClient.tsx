"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { addDays, format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { Calendar, ShieldCheck, Heart, Sparkles, AlertCircle } from "lucide-react"

export default function OvulationCalculatorClient() {
  const [lastPeriod, setLastPeriod] = useState<string>("")
  const [cycleLength, setCycleLength] = useState<number>(28)
  const [lutealPhase, setLutealPhase] = useState<number>(14)
  const [calculated, setCalculated] = useState<boolean>(false)

  // Calculated Dates
  const [ovulationDate, setOvulationDate] = useState<Date | null>(null)
  const [fertileStart, setFertileStart] = useState<Date | null>(null)
  const [fertileEnd, setFertileEnd] = useState<Date | null>(null)
  const [nextPeriod, setNextPeriod] = useState<Date | null>(null)
  const [calendarDays, setCalendarDays] = useState<Date[]>([])

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!lastPeriod) return

    const baseDate = new Date(lastPeriod)
    
    // 1. Calculate next period date
    const nextPeriodDate = addDays(baseDate, cycleLength)
    setNextPeriod(nextPeriodDate)

    // 2. Calculate ovulation day (Next Period Date - Luteal Phase)
    const ovDate = subDays(nextPeriodDate, lutealPhase)
    setOvulationDate(ovDate)

    // 3. Calculate fertile window (Ovulation - 5 days to Ovulation + 1 day)
    const fStart = subDays(ovDate, 5)
    const fEnd = addDays(ovDate, 1)
    setFertileStart(fStart)
    setFertileEnd(fEnd)

    // 4. Generate calendar grid days for ovulation month
    const monthStart = startOfMonth(ovDate)
    const monthEnd = endOfMonth(ovDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    setCalendarDays(days)

    setCalculated(true)
  }

  // Helper to determine day styles
  const getDayClass = (day: Date) => {
    if (!ovulationDate || !fertileStart || !fertileEnd || !nextPeriod || !lastPeriod) return ""

    const baseDate = new Date(lastPeriod)

    // Is period day (5 days from last period)
    const periodEnd = addDays(baseDate, 4)
    if (day >= baseDate && day <= periodEnd) {
      return "bg-red-100 text-red-800 font-bold border border-red-200"
    }

    // Is next period day (5 days from next period)
    const nextPeriodEnd = addDays(nextPeriod, 4)
    if (day >= nextPeriod && day <= nextPeriodEnd) {
      return "bg-red-50 text-red-700 font-medium border border-red-150 border-dashed"
    }

    // Is ovulation day
    if (isSameDay(day, ovulationDate)) {
      return "bg-green-700 text-white font-black border border-green-800 shadow-sm scale-105"
    }

    // Is fertile day
    if (day >= fertileStart && day <= fertileEnd) {
      return "bg-green-100 text-green-800 font-semibold border border-green-200"
    }

    return "bg-white text-gray-700 border border-gray-100"
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl space-y-8">
        {/* Input Card */}
        <Card className="bg-white border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="text-center space-y-3">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Fertility & Conception Planner</Badge>
            <h1 className="text-3xl font-black text-gray-900 font-serif leading-tight">
              Ovulation & Fertile Window Calculator
            </h1>
            <p className="text-xs text-gray-500 leading-relaxed">
              Calculate your fertile window, next period, and ovulation day. Access classical Ayurvedic guidelines to optimize preconception egg quality.
            </p>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4 text-xs">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 font-bold mb-1.5 block">Start Date of Last Period *</label>
                <Input
                  type="date"
                  required
                  value={lastPeriod}
                  onChange={(e) => setLastPeriod(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>
              <div>
                <label className="text-gray-700 font-bold mb-1.5 block">Average Cycle Length (Days) *</label>
                <select
                  value={cycleLength}
                  onChange={(e) => setCycleLength(Number(e.target.value))}
                  className="w-full h-10 px-3 border rounded-md text-xs text-gray-700 bg-white"
                >
                  {[...Array(25)].map((_, i) => (
                    <option key={i} value={21 + i}>{21 + i} Days</option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-750 hover:bg-green-800 text-white font-bold h-11 rounded-xl text-xs flex items-center justify-center gap-1.5">
              Calculate Fertile Window <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </form>
        </Card>

        {calculated && ovulationDate && fertileStart && fertileEnd && nextPeriod && (
          <div className="space-y-8">
            {/* Calendar & metrics card */}
            <Card className="bg-white border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-gray-900 font-serif border-b pb-3">
                Your Fertile Calendar — {format(ovulationDate, "MMMM yyyy")}
              </h2>

              <div className="grid grid-cols-3 gap-4 text-center text-xs">
                <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                  <span className="text-gray-500 text-[10px] block font-semibold uppercase">Ovulation Day</span>
                  <span className="text-green-800 font-black text-sm mt-1 block">{format(ovulationDate, "MMM d")}</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <span className="text-gray-500 text-[10px] block font-semibold uppercase">Fertile Window</span>
                  <span className="text-emerald-800 font-black text-xs mt-1.5 block">
                    {format(fertileStart, "MMM d")} - {format(fertileEnd, "MMM d")}
                  </span>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                  <span className="text-gray-500 text-[10px] block font-semibold uppercase">Next Period</span>
                  <span className="text-red-750 font-black text-sm mt-1 block">{format(nextPeriod, "MMM d")}</span>
                </div>
              </div>

              {/* Grid representation */}
              <div className="border border-gray-150 rounded-2xl p-4 bg-gray-50/50">
                <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-gray-400 mb-2 uppercase">
                  <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {/* Empty cells to pad start of month */}
                  {[...Array(startOfMonth(ovulationDate).getDay())].map((_, i) => (
                    <div key={i} className="h-9 w-9"></div>
                  ))}
                  
                  {calendarDays.map((day, idx) => (
                    <div
                      key={idx}
                      className={`h-9 w-9 rounded-lg flex items-center justify-center text-xs font-semibold select-none ${getDayClass(day)}`}
                    >
                      {format(day, "d")}
                    </div>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap gap-4 justify-center text-[10px] text-gray-500 font-bold pt-4 border-t border-gray-200 mt-4 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 border border-red-200 rounded-sm"></span> Period</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 border border-green-200 rounded-sm"></span> Fertile Window</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-700 rounded-sm"></span> Ovulation Day</span>
                </div>
              </div>
            </Card>

            {/* Ayurvedic scriptural fertility insights (Ritu, Kshetra, Ambu, Bija) */}
            <Card className="bg-white border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 text-base font-serif flex items-center gap-2 border-b pb-2">
                <Sparkles className="w-5 h-5 text-green-700" /> Garbha Sambhava Samagri (The 4 Pillars of Conception)
              </h3>
              <p className="text-xs text-gray-650 leading-relaxed">
                Classical texts compare successful conception to sowing a healthy sprout, which depends on 4 core factors. Imbalances in any of these blockages require correction:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-gray-50 p-4 border rounded-2xl space-y-1">
                  <strong className="text-gray-950 font-bold block">1. Ritu (Season / Timing)</strong>
                  <span className="text-gray-500 text-2xs leading-relaxed block">
                    Corresponds to your fertile window and ovulation cycle. Planning conception during optimal Dosha balance yields healthy results.
                  </span>
                </div>
                <div className="bg-gray-50 p-4 border rounded-2xl space-y-1">
                  <strong className="text-gray-950 font-bold block">2. Kshetra (The Field / Uterus)</strong>
                  <span className="text-gray-500 text-2xs leading-relaxed block">
                    Corresponds to the uterine lining and reproductive health. Healthy lining depends on Apana Vata blood circulation.
                  </span>
                </div>
                <div className="bg-gray-50 p-4 border rounded-2xl space-y-1">
                  <strong className="text-gray-950 font-bold block">3. Ambu (Nutrient Fluids / Ahara Rasa)</strong>
                  <span className="text-gray-500 text-2xs leading-relaxed block">
                    Corresponds to systemic nutrition, hormones, and blood serum. Weak metabolism (Agni) produces toxic waste (Ama) instead of nutrition.
                  </span>
                </div>
                <div className="bg-gray-50 p-4 border rounded-2xl space-y-1">
                  <strong className="text-gray-950 font-bold block">4. Bija (The Seeds / Ovum & Sperm)</strong>
                  <span className="text-gray-500 text-2xs leading-relaxed block">
                    Corresponds to egg quality and sperm parameters. Nourishing Bija requires cooling herbal tonics and clearing local heat.
                  </span>
                </div>
              </div>
            </Card>

            {/* CTA */}
            <div className="bg-green-50/20 border border-green-150 rounded-3xl p-6 text-center space-y-4">
              <Heart className="w-7 h-7 text-green-700 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 text-base font-serif">Optimize Your Fertility Naturally</h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                  Prepare your body for healthy conception. Get a customized preconception Rasayana protocol and Agni-stimulating diet plan under Dr. Arti Singh.
                </p>
              </div>
              <Button className="bg-green-755 hover:bg-green-800 text-white font-bold rounded-xl text-xs h-11 px-8" asChild>
                <Link href="/contact">Schedule Preconception Consultation</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ChevronRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
