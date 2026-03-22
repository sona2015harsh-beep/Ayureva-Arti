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
    amount: 39,
    symbol: "$",
    label: "$39 USD",
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
        } else if (["US", "CA", "GB", "AU", "NZ", "IE"].includes(countryCode)) {
          setPricing({ currency: "USD", amount: 49, symbol: "$", label: "$49 USD" })
        } else if (["AE", "SA", "QA", "OM", "KW", "BH"].includes(countryCode)) {
          setPricing({ currency: "AED", amount: 149, symbol: "AED ", label: "149 AED" })
        } else if (["SG", "MY"].includes(countryCode)) {
          setPricing({ currency: "SGD", amount: 49, symbol: "S$", label: "S$49" })
        } else {
          // Rest of world default
          setPricing({ currency: "USD", amount: 39, symbol: "$", label: "$39 USD" })
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
