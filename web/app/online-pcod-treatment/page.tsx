import { Metadata } from "next"
import Link from "next/link"
import { targetLocations, LocationData } from "@/lib/locations"
import { MapPin, Globe, ChevronRight, Activity, Calendar, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Areas Served for Online PCOD Ayurvedic Consultation | Ayureva",
  description:
    "Ayureva by Dr. Arti Singh serves patients globally in over 60+ cities across India, USA, UK, UAE, Canada, and Australia. Find your location for personalized online Ayurvedic PCOS/PCOD consultation.",
  alternates: {
    canonical: "/online-pcod-treatment",
  },
}

// Helper to group locations by country/region
const getGroupedLocations = (locations: LocationData[]) => {
  const groups: { [key: string]: LocationData[] } = {
    "India (Top Cities)": [],
    "United States": [],
    "United Kingdom": [],
    "UAE & Middle East": [],
    "Canada": [],
    "Australia": [],
    "Southeast Asia": [],
  }

  locations.forEach((loc) => {
    if (loc.country === "India") {
      groups["India (Top Cities)"].push(loc)
    } else if (loc.country === "USA") {
      groups["United States"].push(loc)
    } else if (loc.country === "UK") {
      groups["United Kingdom"].push(loc)
    } else if (loc.country === "UAE" || loc.country === "Saudi Arabia" || loc.country === "Qatar" || loc.country === "Oman" || loc.country === "Kuwait" || loc.country === "Bahrain") {
      groups["UAE & Middle East"].push(loc)
    } else if (loc.country === "Canada") {
      groups["Canada"].push(loc)
    } else if (loc.country === "Australia") {
      groups["Australia"].push(loc)
    } else {
      groups["Southeast Asia"].push(loc)
    }
  })

  return groups
}

export default function LocationsDirectoryPage() {
  const grouped = getGroupedLocations(targetLocations)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-900 to-emerald-950 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-green-800/80 border border-green-700 text-green-200 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Globe className="w-4 h-4 animate-spin-slow" />
            Global Virtual Ayurvedic Care
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-6 leading-tight">
            Our Serviced Locations
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
            Dr. Arti Singh offers specialized online video consultations for PCOS/PCOD reversal. We deliver custom treatment plans and lab-tested medicines to patients in 60+ cities globally.
          </p>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4 flex items-center gap-3">
            <MapPin className="text-green-600 w-7 h-7" />
            Browse Cities & States
          </h2>

          <div className="space-y-12">
            {Object.entries(grouped).map(([region, locations]) => {
              if (locations.length === 0) return null

              return (
                <div key={region} className="group">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-50 text-green-800 flex items-center justify-between">
                    <span>{region}</span>
                    <span className="text-sm font-medium bg-green-50 text-green-700 px-3 py-1 rounded-full">
                      {locations.length} {locations.length === 1 ? "Location" : "Locations"}
                    </span>
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {locations.map((loc) => (
                      <Link
                        key={loc.id}
                        href={`/online-pcod-treatment/${loc.id}`}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-green-300 hover:bg-green-50/30 transition-all group/link"
                      >
                        <div className="truncate pr-2">
                          <p className="font-semibold text-gray-800 text-sm group-hover/link:text-green-700 truncate">
                            {loc.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {loc.state}, {loc.country}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover/link:text-green-600 transition-transform group-hover/link:translate-x-0.5 flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 max-w-4xl">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 text-center border border-green-100 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Don't see your city?
            </h3>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
              We offer online consultations globally. No matter where you are located, you can book a secure virtual video session with Dr. Arti Singh and get medicines shipped directly.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white rounded-full h-12 px-8 font-semibold shadow-md" asChild>
                <Link href="/contact">Book Consultation</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 rounded-full h-12 px-8 font-semibold" asChild>
                <Link href="/pcod-ayurvedic-treatment-online">Learn About Our Treatment</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
