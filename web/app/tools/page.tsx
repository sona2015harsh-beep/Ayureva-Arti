import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Calendar, Activity, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Ayurvedic Health Tools & Calculators | Ayureva",
  description: "Assess your pelvic health, track your cycles, and check your hormonal balance with Ayureva's clinical Ayurvedic calculators.",
  alternates: {
    canonical: "/tools",
  },
}

export default function ToolsHubPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="container mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Interactive Clinical Tools</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 font-serif">
            Hormonal & Fertility Assessment Tools
          </h1>
          <p className="text-gray-650 max-w-xl mx-auto text-sm leading-relaxed">
            Gain immediate insights into your cycle stages, evaluate metabolic warning signs, and understand your baseline Ayurvedic Dosha imbalances.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Tool 1: PCOS checker */}
          <Card className="bg-white border-gray-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="h-48 bg-gradient-to-br from-green-900 to-emerald-800 p-6 flex flex-col justify-between text-white relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_50%)]" />
                <Badge className="bg-green-850/50 text-green-200 hover:bg-green-850/50 self-start border border-green-750">
                  Assessment
                </Badge>
                <Activity className="w-10 h-10 text-green-200" />
                <h3 className="text-xl font-bold font-serif">PCOS Symptom Checker</h3>
              </div>
              <CardHeader className="p-6">
                <CardDescription className="text-xs text-gray-500 leading-relaxed">
                  Evaluate cycle delays, androgenic symptoms (acne, hirsutism), and metabolic fatigue to calculate your relative risk score and identify underlying Kapha-Vata blocks.
                </CardDescription>
              </CardHeader>
            </div>
            <div className="p-6 pt-0">
              <Button className="w-full bg-green-750 hover:bg-green-800 text-white font-bold rounded-xl" asChild>
                <Link href="/tools/pcos-symptom-checker">
                  Check Your Symptoms <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </Card>

          {/* Tool 2: Ovulation calculator */}
          <Card className="bg-white border-gray-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="h-48 bg-gradient-to-br from-emerald-950 to-teal-900 p-6 flex flex-col justify-between text-white relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_50%)]" />
                <Badge className="bg-emerald-900/50 text-emerald-200 hover:bg-emerald-900/50 self-start border border-emerald-700">
                  Fertility
                </Badge>
                <Calendar className="w-10 h-10 text-emerald-200" />
                <h3 className="text-xl font-bold font-serif">Ovulation & Fertility Calculator</h3>
              </div>
              <CardHeader className="p-6">
                <CardDescription className="text-xs text-gray-500 leading-relaxed">
                  Input your cycle parameters to map your fertile windows, expected ovulation day, and next cycle start. Features clinical insights on conception according to classical scriptures.
                </CardDescription>
              </CardHeader>
            </div>
            <div className="p-6 pt-0">
              <Button className="w-full bg-green-750 hover:bg-green-800 text-white font-bold rounded-xl" asChild>
                <Link href="/tools/ovulation-calculator">
                  Calculate Fertile Window <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
