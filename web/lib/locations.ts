export interface LocationData {
  id: string; // The URL slug e.g. "mumbai"
  name: string; // "Mumbai"
  state: string; // "Maharashtra"
  country: string; // "India"
  region: string; // For customized content (e.g. "Western India")
}

export const targetLocations: LocationData[] = [
  // Top Tier 1 Indian Cities (Highest PCOD searches)
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

  // International Tier 1 (High buyer intent for online consultation)
  { id: "california", name: "California", state: "CA", country: "USA", region: "West Coast USA" },
  { id: "new-york", name: "New York", state: "NY", country: "USA", region: "East Coast USA" },
  { id: "texas", name: "Texas", state: "TX", country: "USA", region: "Southern USA" },
  { id: "florida", name: "Florida", state: "FL", country: "USA", region: "Southeast USA" },
  { id: "illinois", name: "Illinois", state: "IL", country: "USA", region: "Midwest USA" },
  { id: "toronto", name: "Toronto", state: "Ontario", country: "Canada", region: "Eastern Canada" },
  { id: "vancouver", name: "Vancouver", state: "British Columbia", country: "Canada", region: "Western Canada" },
  { id: "london", name: "London", state: "England", country: "UK", region: "United Kingdom" },
  { id: "sydney", name: "Sydney", state: "NSW", country: "Australia", region: "Australia" },
  { id: "melbourne", name: "Melbourne", state: "VIC", country: "Australia", region: "Australia" },
  { id: "dubai", name: "Dubai", state: "Dubai", country: "UAE", region: "Middle East" },
  { id: "singapore", name: "Singapore", state: "Singapore", country: "Singapore", region: "Southeast Asia" },
];

export function getLocationBySlug(slug: string): LocationData | undefined {
  return targetLocations.find((loc) => loc.id === slug);
}
