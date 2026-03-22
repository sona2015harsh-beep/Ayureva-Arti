export interface LocationData {
  id: string; // The URL slug e.g. "mumbai"
  name: string; // "Mumbai"
  state: string; // "Maharashtra"
  country: string; // "India"
  region: string; // For customized content (e.g. "Western India")
}

export const targetLocations: LocationData[] = [
  // ─── INDIA (Top Cities) ─────────────────────────────────────────────
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", country: "India", region: "Western India" },
  { id: "delhi", name: "Delhi", state: "Delhi", country: "India", region: "North India" },
  { id: "bangalore", name: "Bangalore", state: "Karnataka", country: "India", region: "South India" },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", country: "India", region: "South India" },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", country: "India", region: "South India" },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", country: "India", region: "East India" },
  { id: "pune", name: "Pune", state: "Maharashtra", country: "India", region: "Western India" },
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat", country: "India", region: "Western India" },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", country: "India", region: "North India" },
  { id: "chandigarh", name: "Chandigarh", state: "Punjab/Haryana", country: "India", region: "North India" },
  { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh", country: "India", region: "North India" },
  { id: "indore", name: "Indore", state: "Madhya Pradesh", country: "India", region: "Central India" },
  { id: "patna", name: "Patna", state: "Bihar", country: "India", region: "East India" },
  { id: "bhopal", name: "Bhopal", state: "Madhya Pradesh", country: "India", region: "Central India" },
  { id: "nagpur", name: "Nagpur", state: "Maharashtra", country: "India", region: "Central India" },
  { id: "ranchi", name: "Ranchi", state: "Jharkhand", country: "India", region: "East India" },
  { id: "guwahati", name: "Guwahati", state: "Assam", country: "India", region: "Northeast India" },
  { id: "noida", name: "Noida", state: "Uttar Pradesh", country: "India", region: "North India" },
  { id: "gurugram", name: "Gurugram", state: "Haryana", country: "India", region: "North India" },

  // ─── USA (High NRI density states + cities) ─────────────────────────
  { id: "california", name: "California", state: "CA", country: "USA", region: "West Coast USA" },
  { id: "new-york", name: "New York", state: "NY", country: "USA", region: "East Coast USA" },
  { id: "texas", name: "Texas", state: "TX", country: "USA", region: "Southern USA" },
  { id: "florida", name: "Florida", state: "FL", country: "USA", region: "Southeast USA" },
  { id: "illinois", name: "Illinois", state: "IL", country: "USA", region: "Midwest USA" },
  { id: "new-jersey", name: "New Jersey", state: "NJ", country: "USA", region: "East Coast USA" },
  { id: "georgia", name: "Georgia", state: "GA", country: "USA", region: "Southeast USA" },
  { id: "virginia", name: "Virginia", state: "VA", country: "USA", region: "East Coast USA" },
  { id: "washington", name: "Washington", state: "WA", country: "USA", region: "Pacific Northwest USA" },
  { id: "pennsylvania", name: "Pennsylvania", state: "PA", country: "USA", region: "East Coast USA" },
  { id: "michigan", name: "Michigan", state: "MI", country: "USA", region: "Midwest USA" },
  { id: "ohio", name: "Ohio", state: "OH", country: "USA", region: "Midwest USA" },
  { id: "massachusetts", name: "Massachusetts", state: "MA", country: "USA", region: "Northeast USA" },
  { id: "maryland", name: "Maryland", state: "MD", country: "USA", region: "East Coast USA" },
  { id: "arizona", name: "Arizona", state: "AZ", country: "USA", region: "Southwest USA" },
  { id: "north-carolina", name: "North Carolina", state: "NC", country: "USA", region: "Southeast USA" },
  { id: "connecticut", name: "Connecticut", state: "CT", country: "USA", region: "Northeast USA" },
  { id: "minnesota", name: "Minnesota", state: "MN", country: "USA", region: "Midwest USA" },
  { id: "colorado", name: "Colorado", state: "CO", country: "USA", region: "Mountain West USA" },

  // ─── UK (Major cities + high South Asian population) ────────────────
  { id: "london", name: "London", state: "England", country: "UK", region: "United Kingdom" },
  { id: "birmingham", name: "Birmingham", state: "England", country: "UK", region: "United Kingdom" },
  { id: "manchester", name: "Manchester", state: "England", country: "UK", region: "United Kingdom" },
  { id: "leicester", name: "Leicester", state: "England", country: "UK", region: "United Kingdom" },
  { id: "leeds", name: "Leeds", state: "England", country: "UK", region: "United Kingdom" },
  { id: "bradford", name: "Bradford", state: "England", country: "UK", region: "United Kingdom" },
  { id: "glasgow", name: "Glasgow", state: "Scotland", country: "UK", region: "United Kingdom" },
  { id: "edinburgh", name: "Edinburgh", state: "Scotland", country: "UK", region: "United Kingdom" },

  // ─── UAE & Gulf (Massive Indian expat population) ───────────────────
  { id: "dubai", name: "Dubai", state: "Dubai", country: "UAE", region: "Middle East" },
  { id: "abu-dhabi", name: "Abu Dhabi", state: "Abu Dhabi", country: "UAE", region: "Middle East" },
  { id: "sharjah", name: "Sharjah", state: "Sharjah", country: "UAE", region: "Middle East" },
  { id: "riyadh", name: "Riyadh", state: "Riyadh", country: "Saudi Arabia", region: "Middle East" },
  { id: "jeddah", name: "Jeddah", state: "Makkah", country: "Saudi Arabia", region: "Middle East" },
  { id: "doha", name: "Doha", state: "Qatar", country: "Qatar", region: "Middle East" },
  { id: "muscat", name: "Muscat", state: "Muscat", country: "Oman", region: "Middle East" },
  { id: "kuwait-city", name: "Kuwait City", state: "Kuwait", country: "Kuwait", region: "Middle East" },
  { id: "bahrain", name: "Bahrain", state: "Bahrain", country: "Bahrain", region: "Middle East" },

  // ─── Canada (High Indian diaspora) ──────────────────────────────────
  { id: "toronto", name: "Toronto", state: "Ontario", country: "Canada", region: "Eastern Canada" },
  { id: "vancouver", name: "Vancouver", state: "British Columbia", country: "Canada", region: "Western Canada" },
  { id: "brampton", name: "Brampton", state: "Ontario", country: "Canada", region: "Eastern Canada" },
  { id: "calgary", name: "Calgary", state: "Alberta", country: "Canada", region: "Western Canada" },
  { id: "edmonton", name: "Edmonton", state: "Alberta", country: "Canada", region: "Western Canada" },
  { id: "mississauga", name: "Mississauga", state: "Ontario", country: "Canada", region: "Eastern Canada" },

  // ─── Australia (Strong NRI community) ───────────────────────────────
  { id: "sydney", name: "Sydney", state: "NSW", country: "Australia", region: "Australia" },
  { id: "melbourne", name: "Melbourne", state: "VIC", country: "Australia", region: "Australia" },
  { id: "perth", name: "Perth", state: "WA", country: "Australia", region: "Australia" },
  { id: "brisbane", name: "Brisbane", state: "QLD", country: "Australia", region: "Australia" },

  // ─── Singapore & Southeast Asia ─────────────────────────────────────
  { id: "singapore", name: "Singapore", state: "Singapore", country: "Singapore", region: "Southeast Asia" },
  { id: "kuala-lumpur", name: "Kuala Lumpur", state: "KL", country: "Malaysia", region: "Southeast Asia" },
];

export function getLocationBySlug(slug: string): LocationData | undefined {
  return targetLocations.find((loc) => loc.id === slug);
}
