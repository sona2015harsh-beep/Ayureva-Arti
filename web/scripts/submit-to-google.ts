#!/usr/bin/env npx ts-node
/**
 * Google Indexing API - Bulk URL Submission Script
 * 
 * This script pings Google to immediately crawl and index all pages
 * on ayureva.in instead of waiting for natural discovery.
 * 
 * SETUP (one-time):
 * 1. Go to https://console.cloud.google.com
 * 2. Create a new project (or select existing)
 * 3. Enable "Web Search Indexing API" (search for it in APIs & Services > Library)
 * 4. Create a Service Account (APIs & Services > Credentials > Create Credentials > Service Account)
 * 5. Download the JSON key file and save it as: web/scripts/google-service-account.json
 * 6. Go to Google Search Console > Settings > Users and permissions
 * 7. Add the service account email (from the JSON file) as an OWNER
 * 
 * USAGE:
 *   npx ts-node scripts/submit-to-google.ts
 */

import { google } from "googleapis"
import { blogPosts } from "../lib/blog-data"
import { targetLocations } from "../lib/locations"

const SITE_URL = "https://ayureva.in"

// All URLs to submit for indexing
function getAllUrls(): string[] {
  const urls: string[] = []

  // Static pages
  urls.push(`${SITE_URL}/`)
  urls.push(`${SITE_URL}/about`)
  urls.push(`${SITE_URL}/services`)
  urls.push(`${SITE_URL}/contact`)
  urls.push(`${SITE_URL}/disclaimer`)
  urls.push(`${SITE_URL}/blog`)
  urls.push(`${SITE_URL}/pcod-ayurvedic-treatment-online`)
  urls.push(`${SITE_URL}/mobile-app`)
  urls.push(`${SITE_URL}/ayurveda-suggestions`)

  // All 33+ blog posts
  for (const post of blogPosts) {
    urls.push(`${SITE_URL}/blog/${post.slug}`)
  }

  // All 25+ programmatic location pages
  for (const loc of targetLocations) {
    urls.push(`${SITE_URL}/online-pcod-treatment/${loc.id}`)
  }

  return urls
}

async function submitUrls() {
  console.log("🔑 Loading Google Service Account credentials...")

  let auth
  try {
    const keyFile = require("./google-service-account.json")
    auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ["https://www.googleapis.com/auth/indexing"],
    })
  } catch (error) {
    console.error("\n❌ ERROR: google-service-account.json not found!")
    console.error("   Please follow the SETUP instructions at the top of this file.")
    console.error("   Save the key file as: web/scripts/google-service-account.json\n")
    process.exit(1)
  }

  const client = await auth.getClient()
  const urls = getAllUrls()

  console.log(`\n📋 Found ${urls.length} URLs to submit for indexing.\n`)

  let success = 0
  let failed = 0

  for (const url of urls) {
    try {
      const res = await (client as any).request({
        url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
        method: "POST",
        data: {
          url: url,
          type: "URL_UPDATED",
        },
      })

      if (res.status === 200) {
        console.log(`  ✅ ${url}`)
        success++
      } else {
        console.log(`  ⚠️  ${url} — Status: ${res.status}`)
        failed++
      }
    } catch (error: any) {
      const msg = error?.response?.data?.error?.message || error.message
      console.log(`  ❌ ${url} — ${msg}`)
      failed++
    }

    // Rate limit: Google allows 200 requests/day, add small delay
    await new Promise((r) => setTimeout(r, 200))
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`📊 RESULTS: ${success} submitted ✅ | ${failed} failed ❌`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  if (success > 0) {
    console.log("🚀 Google will now prioritize crawling these URLs!")
    console.log("   Check indexing status in Google Search Console within 24-48 hours.\n")
  }
}

submitUrls().catch(console.error)
