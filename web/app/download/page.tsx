import { Metadata } from "next"
import Link from "next/link"
import { Download, ShieldCheck, Smartphone, Settings, ArrowLeft, AlertCircle, Info, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Download Ayureva App | Install Android APK",
  description: "Download the official Ayureva app for BAMS & AIAPGT preparation. Direct APK download with step-by-step installation instructions.",
  alternates: {
    canonical: "/download",
  },
}

export default function DownloadPage() {
  const primaryApkUrl = "https://sopzimimiihskkwtwnhk.supabase.co/storage/v1/object/public/downloads/app-debug.apk"
  const fallbackApkUrl = "https://fpibemvovdkddcamejbq.supabase.co/storage/v1/object/public/downloads/app-debug.apk"

  const steps = [
    {
      icon: <Download className="w-6 h-6 text-green-700" />,
      title: "1. Download the APK",
      desc: "Click the download button above to save the 'app-debug.apk' file to your Android device."
    },
    {
      icon: <Settings className="w-6 h-6 text-green-700" />,
      title: "2. Enable Unknown Sources",
      desc: "Go to Settings → Apps → Chrome (or your browser) → Install unknown apps, and switch on 'Allow from this source'."
    },
    {
      icon: <Smartphone className="w-6 h-6 text-green-700" />,
      title: "3. Install & Start",
      desc: "Open the downloaded .apk file from your browser downloads or file manager, tap 'Install', and launch Ayureva!"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-100 py-4 shadow-xs">
        <div className="container mx-auto px-4 max-w-4xl flex items-center justify-between">
          <Link href="/mobile-app" className="inline-flex items-center text-sm font-semibold text-green-700 hover:text-green-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to App Info
          </Link>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Secured Download</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl mt-12">
        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />
          
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1 rounded-full text-xs font-bold mb-4">
            Android Package (.APK)
          </Badge>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 font-serif">
            Get the Ayureva App
          </h1>
          
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Install the Ayureva mobile app directly on your Android device to access live classes, mock tests, and download video lectures for offline study.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 max-w-md mx-auto">
            <Button size="lg" className="h-16 px-8 text-lg bg-green-700 hover:bg-green-800 shadow-xl shadow-green-900/10 w-full rounded-2xl" asChild>
              <a href={primaryApkUrl} download>
                <Download className="mr-3 h-6 h-6 animate-bounce" /> Download APK (Direct)
              </a>
            </Button>
            
            <a 
              href={fallbackApkUrl} 
              download
              className="text-sm text-green-600 hover:underline inline-flex items-center gap-1.5"
            >
              Alternative Download Link <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6 flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
            <span>File Size: ~60 MB</span>
            <span>•</span>
            <span>Version: Latest Debug</span>
            <span>•</span>
            <span>Requires: Android 6.0+</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Info className="text-green-700 w-5 h-5" /> How to Install the APK
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Alert */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4 text-left">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900 text-sm mb-1">Safety Notice</h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              When installing, Android may show a "Block by Play Protect" warning since this APK is hosted privately on our secure servers and not the Google Play Store. You can safely proceed by clicking <strong>"Install Anyway"</strong>. We guarantee this package is 100% virus-free and verified.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
