"use client"

import { useState, useEffect } from "react"

export interface PricingData {
  currency: string
  amount: number
  symbol: string
  label: string
}

export function useGeoPricing() {
  const [pricing, setPricing] = useState<PricingData>({
    currency: "USD",
    amount: 99,
    symbol: "$",
    label: "$99 USD",
  })
  
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPricing() {
      try {
        // geojs is highly reliable, free, and unrestricted for client-side country code lookups
        const response = await fetch("https://get.geojs.io/v1/ip/country.json")
        const data = await response.json()
        const countryCode = data.country

        if (countryCode === "IN") {
          setPricing({ currency: "INR", amount: 500, symbol: "₹", label: "₹500 INR" })
        } else if (countryCode === "GB") {
          setPricing({ currency: "GBP", amount: 79, symbol: "£", label: "£79 GBP" })
        } else if (["IE", "DE", "FR", "NL", "BE", "AT", "ES", "IT", "CH", "SE", "DK", "NO", "FI", "PL", "PT"].includes(countryCode)) {
          setPricing({ currency: "EUR", amount: 89, symbol: "€", label: "€89 EUR" })
        } else if (["AE", "SA", "QA", "OM", "KW", "BH"].includes(countryCode)) {
          setPricing({ currency: "AED", amount: 249, symbol: "AED ", label: "249 AED" })
        } else {
          // USA, Canada, Australia, New Zealand, Singapore, Malaysia, and Rest of World default
          setPricing({ currency: "USD", amount: 99, symbol: "$", label: "$99 USD" })
        }
      } catch (error) {
        console.error("Geo-pricing fallback triggered.", error)
        // Keep default USD pricing
      } finally {
        setIsLoading(false)
      }
    }

    fetchPricing()
  }, [])

  return { pricing, isLoading }
}
