"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Star, Clock, FileText, CreditCard, CheckCircle2, User, ChevronDown, AlertCircle, Sparkles } from "lucide-react"
import { useGeoPricing } from "@/hooks/use-geo-pricing"
import { useFunnelAnalytics } from "@/hooks/use-funnel-analytics"
import { createConsultationRazorpayOrder, verifyConsultationPayment } from "@/actions/booking-payment"
import { createConsultationPaypalOrder, verifyAndCapturePaypalPayment } from "@/actions/paypal-payment"

interface PayPageClientProps {
  lead: {
    id: string
    full_name: string
    email: string
    phone_number: string
    message: string
    status: string
  }
}

export default function PayPageClient({ lead }: PayPageClientProps) {
  const router = useRouter()
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const { pricing, isLoading } = useGeoPricing()
  const { logEvent } = useFunnelAnalytics()

  // Track page mount
  useEffect(() => {
    logEvent("checkout_page_viewed", { leadId: lead.id })
  }, [lead.id])

  // Dynamically load PayPal Script
  const loadPaypalScript = (currency: string) => {
    return new Promise((resolve) => {
      const scriptId = "paypal-sdk-script"
      const existingScript = document.getElementById(scriptId)
      if (existingScript) {
        resolve(true)
        return
      }
      const script = document.createElement("script")
      script.id = scriptId
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb"}&currency=${currency}`
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  // Load PayPal SDK only when currency is not INR
  useEffect(() => {
    if (!isLoading && pricing.currency !== "INR") {
      const initPaypal = async () => {
        const checkoutCurrency = pricing.currency === "AED" ? "USD" : pricing.currency
        const loaded = await loadPaypalScript(checkoutCurrency)
        if (loaded && (window as any).paypal) {
          setPaypalLoaded(true)
        } else {
          setPaymentError("Failed to load PayPal payment SDK. Please try again.")
        }
      }
      initPaypal()
    }
  }, [isLoading, pricing.currency])

  // Render PayPal buttons
  useEffect(() => {
    if (paypalLoaded && (window as any).paypal && document.getElementById("paypal-button-container-checkout")) {
      const container = document.getElementById("paypal-button-container-checkout")
      if (container) container.innerHTML = ""

      ;(window as any).paypal.Buttons({
        style: {
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "pay",
        },
        createOrder: async () => {
          setIsVerifyingPayment(true)
          setPaymentError(null)
          const res = await createConsultationPaypalOrder(lead.id, pricing.amount, pricing.currency)
          if (res.success && res.orderId) {
            return res.orderId
          } else {
            setPaymentError(res.message || "Failed to create PayPal order.")
            setIsVerifyingPayment(false)
            return ""
          }
        },
        onApprove: async (data: any) => {
          setIsVerifyingPayment(true)
          const verifyResult = await verifyAndCapturePaypalPayment(lead.id, data.orderID)
          if (verifyResult.success) {
            logEvent("payment_completed", { leadId: lead.id, gateway: "paypal" })
            router.push(`/pay/${lead.id}/success`)
          } else {
            setPaymentError(verifyResult.message || "PayPal verification failed. Please contact support.")
          }
          setIsVerifyingPayment(false)
        },
        onError: (err: any) => {
          console.error("PayPal checkout error:", err)
          setPaymentError("An error occurred during PayPal checkout. Please try again.")
          setIsVerifyingPayment(false)
        },
        onCancel: () => {
          setIsVerifyingPayment(false)
        },
      }).render("#paypal-button-container-checkout")
    }
  }, [paypalLoaded, pricing, lead.id])

  // Load Razorpay Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleRazorpayCheckout = async () => {
    setIsVerifyingPayment(true)
    setPaymentError(null)
    try {
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        setPaymentError("Failed to load Razorpay payment script. Please check your internet connection.")
        setIsVerifyingPayment(false)
        return
      }

      const orderResult = await createConsultationRazorpayOrder(lead.id, 500)
      if (!orderResult.success || !orderResult.orderId) {
        setPaymentError(orderResult.message || "Failed to initiate payment session. Please try again.")
        setIsVerifyingPayment(false)
        return
      }

      const options = {
        key: orderResult.keyId,
        amount: orderResult.amount,
        currency: orderResult.currency,
        name: "Ayureva Clinic",
        description: "Specialist Ayurvedic Consultation",
        order_id: orderResult.orderId,
        handler: async function (response: any) {
          setIsVerifyingPayment(true)
          const verifyResult = await verifyConsultationPayment(
            lead.id,
            orderResult.orderId,
            response.razorpay_payment_id,
            response.razorpay_signature
          )
          
          if (verifyResult.success) {
            logEvent("payment_completed", { leadId: lead.id, gateway: "razorpay" })
            router.push(`/pay/${lead.id}/success`)
          } else {
            setPaymentError(verifyResult.message || "Payment verification failed. Please contact clinic support.")
          }
          setIsVerifyingPayment(false)
        },
        prefill: {
          name: lead.full_name,
          email: lead.email,
          contact: lead.phone_number,
        },
        theme: {
          color: "#047857",
        },
        modal: {
          ondismiss: function () {
            setIsVerifyingPayment(false)
          },
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error("Razorpay trigger error:", err)
      setPaymentError("An unexpected error occurred during payment. Please contact support.")
      setIsVerifyingPayment(false)
    }
  }

  const faqs = [
    {
      q: "How does the online video consultation work?",
      a: "Once payment is verified, you pick a suitable time slot on our Calendly booking calendar. You will receive a Google Meet video conference link in your inbox. Dr. Arti Singh will connect with you via video call to discuss your health concern, analyze your Dosha constitution, and explain your treatment protocol."
    },
    {
      q: "What is included in the consultation fee?",
      a: "The fee includes a 45–60 minute secure video call with Dr. Arti, a case history review, a customized herbal medicine formulation, a personalized region-specific diet and lifestyle plan, and 14 days of WhatsApp message support."
    },
    {
      q: "Are diagnostic reports required before booking?",
      a: "No, reports are not mandatory. However, if you have recent pelvic ultrasound (USG), thyroid panels, or hormone profiles done in the last 6 months, please keep them ready during the video call so Dr. Arti can review them."
    }
  ]

  const reviews = [
    {
      name: "Meera S. (Mumbai)",
      text: "I struggled with severe bloating and painful menstrual cycles for 2 years. Dr. Arti's personalized diet advice and cooling herbs regularized my periods and completely deflated my stomach. High-quality consultation!",
      rating: 5
    },
    {
      name: "Kiran J. (Delhi)",
      text: "I had a 4cm chocolate cyst on my left ovary and wanted to avoid surgery. After following Dr. Arti's treatment for 4 months, my follow-up ultrasound showed the cyst had dissolved completely. Highly recommend!",
      rating: 5
    }
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column - Reassurance, Bio, Testimonials, FAQ */}
        <div className="lg:col-span-7 space-y-8">
          {/* Header */}
          <div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mb-3">Secure Patient Checkout</Badge>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-serif">
              Complete Your Consultation Request
            </h1>
            <p className="text-gray-600 mt-2">
              Secure your appointment slot with Dr. Arti Singh and get a personalized, root-cause Ayurvedic treatment plan.
            </p>
          </div>

          {/* Doctor Bio */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-700 shrink-0 font-bold text-lg border border-green-200">
              AS
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Dr. Arti Singh (B.A.M.S.)</h3>
              <p className="text-xs text-green-700 font-semibold uppercase tracking-wider mt-0.5">Ayurvedic Physician & Women's Specialist</p>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Dr. Arti Singh holds a Bachelor of Ayurvedic Medicine and Surgery (B.A.M.S.) with clinical registration (Reg No. 4200 Bihar). She specializes in reversing PCOS/PCOD, menstrual disorders, ovarian chocolate cysts, thyroid issues, and hormonal imbalances using traditional, medically managed cooling protocols.
              </p>
            </div>
          </div>

          {/* What's Included */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" /> What Your Consultation Includes
            </h3>
            <ul className="grid sm:grid-cols-2 gap-3 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span> 45-60 min private video call with Dr. Arti
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span> Complete case history & Dosha diagnostics
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span> Customized herbal formulation details
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span> Personalized diet & lifestyle charts
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span> 14 days of WhatsApp follow-up support
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span> Official digital prescription PDF
              </li>
            </ul>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" /> Patient Recovery Stories
            </h3>
            <div className="space-y-4">
              {reviews.map((rev, idx) => (
                <div key={idx} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex gap-0.5 text-yellow-500 mb-2">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 italic leading-relaxed">"{rev.text}"</p>
                  <span className="text-2xs font-bold text-gray-800 mt-2 block">— {rev.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <h4 className="font-bold text-gray-800 text-xs mb-1">Q. {faq.q}</h4>
                  <p className="text-2xs text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Booking Summary & Checkout */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm sticky top-24 space-y-6">
          <div className="border-b pb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Booking Review</span>
            <h2 className="text-2xl font-black text-gray-900 font-serif mt-1">{lead.full_name}</h2>
            <p className="text-xs text-gray-500 mt-1">Status: Pending Checkout</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Patient:</span>
              <span className="font-semibold text-gray-800">{lead.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span>WhatsApp Phone:</span>
              <span className="font-semibold text-gray-800">{lead.phone_number}</span>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span className="font-semibold text-gray-800">{lead.email || "Pending info"}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3 mt-3 font-bold text-base text-gray-950">
              <span>Consultation Fee:</span>
              {isLoading ? (
                <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <span className="text-green-700">{pricing.label}</span>
              )}
            </div>
          </div>

          {paymentError && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{paymentError}</span>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-6 gap-2 text-xs text-gray-500">
              <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              Verifying currency options...
            </div>
          ) : pricing.currency === "INR" ? (
            <div className="space-y-3">
              <Button
                onClick={handleRazorpayCheckout}
                disabled={isVerifyingPayment}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold h-14 rounded-xl shadow-md text-base flex items-center justify-center gap-2"
              >
                {isVerifyingPayment ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay {pricing.label} & Book Slot →
                  </>
                )}
              </Button>
              <p className="text-[10px] text-gray-400 text-center">
                UPI • Cards • NetBanking • Wallets — Powered by Razorpay
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div id="paypal-button-container-checkout" className="min-h-[150px] w-full">
                {!paypalLoaded && (
                  <div className="flex flex-col items-center justify-center py-8 gap-2 text-xs text-gray-500">
                    <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    Loading Secure PayPal Checkout...
                  </div>
                )}
              </div>
              <p className="text-[10px] text-gray-400 text-center">
                Pay securely via credit card or PayPal account funds
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-4 text-[10px] text-gray-400">
            <span>🛡️ 256-bit SSL Encryption</span>
            <span>🔒 Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  )
}
