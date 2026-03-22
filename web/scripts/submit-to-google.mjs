/**
 * Google Indexing API - Bulk URL Submission Script
 * 
 * Pings Google to immediately crawl and index all Ayureva pages.
 * 
 * PREREQUISITE:
 * - Add ayureva-arti@ayureva-arti.iam.gserviceaccount.com as OWNER 
 *   in Google Search Console → Settings → Users and Permissions
 * 
 * USAGE:  node scripts/submit-to-google.mjs
 */

import { google } from "googleapis";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = "https://www.ayureva.in";

// ─── ALL URLS TO INDEX ────────────────────────────────────────────────
const STATIC_PAGES = [
  "/",
  "/about",
  "/services",
  "/contact",
  "/blog",
  "/disclaimer",
  "/pcod-ayurvedic-treatment-online",
  "/mobile-app",
  "/ayurveda-suggestions",
  "/privacy-policy",
  "/terms-conditions",
  "/refund-policy",
];

const BLOG_SLUGS = [
  "ayurvedic-management-pcos-guide",
  "pcod-vs-pcos-ayurvedic-difference",
  "ayurvedic-infertility-treatment-egg-quality",
  "endometriosis-ayurvedic-treatment-chocolate-cysts",
  "hypothyroidism-ayurvedic-treatment-diet",
  "heavy-period-bleeding-ayurvedic-treatment",
  "blocked-fallopian-tubes-ayurvedic-treatment",
  "ayurvedic-weight-loss-tips-agni",
  "recurrent-uti-ayurvedic-treatment-home-remedies",
  "white-discharge-leucorrhea-ayurvedic-treatment",
  "fatty-liver-ayurvedic-treatment-diet",
  "diabetes-ayurvedic-treatment-bloodsugar",
  "chronic-fatigue-ayurvedic-treatment-energy",
  "ibs-ayurvedic-treatment-grahani",
  "acid-reflux-gerd-ayurvedic-treatment",
  "severe-constipation-ayurvedic-remedies",
  "bloating-gas-ayurvedic-kitchen-spices",
  "hemorrhoids-piles-ayurvedic-treatment-kshara",
  "hormonal-acne-ayurvedic-treatment-face-mapping",
  "severe-hair-fall-ayurvedic-treatment-regrowth",
  "melasma-pigmentation-ayurvedic-treatment",
  "anti-aging-ayurvedic-rasayana-herbs",
  "dinacharya-ayurvedic-daily-routine",
  "anxiety-ayurvedic-treatment-vata-mind",
  "sleep-hygiene-insomnia-ayurveda-nidra",
  "vata-pitta-kapha-dosha-quiz-guide",
  "menopause-ayurvedic-treatment-hot-flashes",
  "post-partum-care-ayurveda-sutika-paricharya",
  "milk-ghee-ayurvedic-truth",
  "seasonal-detox-ritucharya-ayurveda",
  "eczema-ayurvedic-treatment-vicharchika",
  "psoriasis-ayurvedic-treatment-kitibha",
  "can-ayurveda-cure-pcod-permanently",
  "is-ashwagandha-good-for-pcos",
  "which-fruit-is-best-for-pcos-in-ayurveda",
];

const LOCATION_SLUGS = [
  // India
  "mumbai", "delhi", "bangalore", "hyderabad", "chennai",
  "kolkata", "pune", "ahmedabad", "jaipur", "chandigarh",
  "lucknow", "indore", "patna", "bhopal", "nagpur",
  "ranchi", "guwahati", "noida", "gurugram",
  // USA
  "california", "new-york", "texas", "florida", "illinois",
  "new-jersey", "georgia", "virginia", "washington", "pennsylvania",
  "michigan", "ohio", "massachusetts", "maryland", "arizona",
  "north-carolina", "connecticut", "minnesota", "colorado",
  // UK
  "london", "birmingham", "manchester", "leicester", "leeds",
  "bradford", "glasgow", "edinburgh",
  // UAE & Gulf
  "dubai", "abu-dhabi", "sharjah", "riyadh", "jeddah",
  "doha", "muscat", "kuwait-city", "bahrain",
  // Canada
  "toronto", "vancouver", "brampton", "calgary", "edmonton", "mississauga",
  // Australia
  "sydney", "melbourne", "perth", "brisbane",
  // Southeast Asia
  "singapore", "kuala-lumpur",
];

// ─── BUILD FULL URL LIST ──────────────────────────────────────────────
function getAllUrls() {
  const urls = [];
  for (const page of STATIC_PAGES) {
    urls.push(`${SITE_URL}${page}`);
  }
  for (const slug of BLOG_SLUGS) {
    urls.push(`${SITE_URL}/blog/${slug}`);
  }
  for (const loc of LOCATION_SLUGS) {
    urls.push(`${SITE_URL}/online-pcod-treatment/${loc}`);
  }
  return urls;
}

// ─── SUBMIT TO GOOGLE ─────────────────────────────────────────────────
async function submitUrls() {
  console.log("🔑 Loading Google Service Account credentials...");

  let keyFile;
  try {
    const raw = readFileSync(join(__dirname, "google-service-account.json"), "utf8");
    keyFile = JSON.parse(raw);
  } catch {
    console.error("\n❌ ERROR: google-service-account.json not found in scripts/ folder!");
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    credentials: keyFile,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });

  const client = await auth.getClient();
  const urls = getAllUrls();

  console.log(`\n📋 Submitting ${urls.length} URLs to Google Indexing API...\n`);

  let success = 0;
  let failed = 0;

  for (const url of urls) {
    try {
      const res = await client.request({
        url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
        method: "POST",
        data: {
          url: url,
          type: "URL_UPDATED",
        },
      });

      if (res.status === 200) {
        console.log(`  ✅ ${url}`);
        success++;
      } else {
        console.log(`  ⚠️  ${url} — Status: ${res.status}`);
        failed++;
      }
    } catch (error) {
      const msg = error?.response?.data?.error?.message || error.message;
      console.log(`  ❌ ${url} — ${msg}`);
      failed++;
    }

    // Small delay to respect rate limits
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 RESULTS: ${success} submitted ✅ | ${failed} failed ❌`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  if (success > 0) {
    console.log("🚀 Google will now prioritize crawling these URLs!");
    console.log("   Check indexing status in Search Console within 24-48h.\n");
  }
}

submitUrls().catch(console.error);
