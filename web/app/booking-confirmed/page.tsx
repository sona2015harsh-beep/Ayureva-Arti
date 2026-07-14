import Link from "next/link"
import { CheckCircle, Calendar, ShieldCheck, ArrowRight, Video } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BookingConfirmedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-green-100 text-center">
        <div>
          <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center border border-green-200 animate-bounce">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
            Booking Confirmed!
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Your consultation has been scheduled successfully.
          </p>
        </div>

        <div className="bg-green-50 rounded-xl p-4 border border-green-100/50 text-left space-y-3">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-green-800 uppercase tracking-wider">Next Steps</p>
              <p className="text-sm text-green-900 font-medium">Check your Email / WhatsApp</p>
              <p className="text-xs text-green-700">
                You will receive a confirmation message with the video consultation link and calendar invite.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2 border-t border-green-200/50">
            <Video className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-green-800 uppercase tracking-wider">Session Info</p>
              <p className="text-sm text-green-900 font-medium">Prepare for your session</p>
              <p className="text-xs text-green-700">
                Please keep any past medical reports, prescriptions, or symptoms notes ready for Dr. Arti Singh.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl shadow-md flex items-center justify-center gap-2">
            <Link href="/">
              Return to Homepage
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure connection & privacy guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  )
}
