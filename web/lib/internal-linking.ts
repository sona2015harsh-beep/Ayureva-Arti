export const KEYWORD_DICT: Record<string, string> = {
  // Main Pages
  "Ayurvedic treatment": "/services",
  "Ayurvedic consultation": "/contact",
  "Dr. Arti Singh": "/about",
  "PCOS treatment": "/services",
  "PCOD treatment": "/services",
  "online Ayurvedic consultation": "/contact",
  "Ayurveda": "/about",
  "fertility treatment": "/services",
  
  // High-Intent Booking & Landing Page Mappings
  "PCOD treatment online": "/pcod-ayurvedic-treatment-online",
  "PCOS treatment online": "/pcod-ayurvedic-treatment-online",
  "Ayurvedic PCOD treatment online": "/pcod-ayurvedic-treatment-online",
  "PCOD treatment locations": "/online-pcod-treatment",
  "PCOS treatment locations": "/online-pcod-treatment",

  // Core Condition Blog Articles (High-intent search terms mapping)
  "PCOS vs PCOD": "/blog/pcod-vs-pcos-ayurvedic-difference",
  "PCOS diet guide": "/blog/which-fruit-is-best-for-pcos-in-ayurveda",
  "Ayurvedic diet for PCOS": "/blog/which-fruit-is-best-for-pcos-in-ayurveda",
  "hormonal imbalance recovery": "/blog/ayurvedic-management-pcos-guide",
  "infertility treatment": "/blog/ayurvedic-infertility-treatment-egg-quality",
  "improve egg quality": "/blog/ayurvedic-infertility-treatment-egg-quality",
  "endometriosis treatment": "/blog/endometriosis-ayurvedic-treatment-chocolate-cysts",
  "thyroid treatment": "/blog/hypothyroidism-ayurvedic-treatment-diet",
  "UTI treatment": "/blog/recurrent-uti-ayurvedic-treatment-home-remedies",
  "recurrent UTI remedies": "/blog/recurrent-uti-ayurvedic-treatment-home-remedies",
  "heavy period bleeding": "/blog/heavy-period-bleeding-ayurvedic-treatment",
  "PCOS reversal guide": "/blog/ayurvedic-management-pcos-guide",
  "Panchakarma detox": "/blog/seasonal-detox-ritucharya-immunity",
  "Shatavari benefits": "/blog/ayurvedic-infertility-treatment-egg-quality",
  "Ashoka tree benefits": "/blog/heavy-period-bleeding-ayurvedic-treatment",
  "Kanchanar Guggulu PCOD": "/blog/endometriosis-ayurvedic-treatment-chocolate-cysts",
  "insulin resistance PCOS": "/blog/pcod-vs-pcos-ayurvedic-difference",
  "weight loss tips": "/blog/ayurvedic-weight-loss-tips-agni",
  "anxiety treatment": "/blog/anxiety-ayurvedic-treatment-vata-mind",
  "hormonal acne treatment": "/blog/hormonal-acne-ayurvedic-treatment-face-mapping",
  "Dinacharya daily routine": "/blog/dinacharya-ayurvedic-daily-routine",
  "Ritucharya seasonal detox": "/blog/seasonal-detox-ritucharya-immunity",

  // Indexing optimizations for crawled-but-unindexed posts
  "IBS treatment": "/blog/ibs-ayurvedic-treatment-grahani",
  "acid reflux treatment": "/blog/acid-reflux-gerd-ayurvedic-treatment",
  "GERD treatment": "/blog/acid-reflux-gerd-ayurvedic-treatment",
  "sleep hygiene guidelines": "/blog/sleep-hygiene-insomnia-ayurveda-nidra",
  "insomnia treatment": "/blog/sleep-hygiene-insomnia-ayurveda-nidra",
  "milk and ghee facts": "/blog/milk-ghee-ayurveda-myths-facts",
  "A2 Ghee benefits": "/blog/milk-ghee-ayurveda-myths-facts",
  "blocked fallopian tubes": "/blog/blocked-fallopian-tubes-ayurvedic-treatment",
  "Dosha balance quiz": "/blog/vata-pitta-kapha-dosha-quiz-guide",
  "Vata Pitta Kapha types": "/blog/vata-pitta-kapha-dosha-quiz-guide",
  "Eczema treatment": "/blog/eczema-ayurvedic-treatment-vicharchika",
  "Vicharchika care": "/blog/eczema-ayurvedic-treatment-vicharchika",
  "postpartum care": "/blog/post-partum-care-ayurveda-sutika-paricharya",
  "Sutika routine": "/blog/post-partum-care-ayurveda-sutika-paricharya",
  "anti-aging herbs": "/blog/anti-aging-ayurvedic-rasayana-herbs",
  "Rasayana herbs": "/blog/anti-aging-ayurvedic-rasayana-herbs",
  "cure PCOD permanently": "/blog/can-ayurveda-cure-pcod-permanently",
  "chronic fatigue treatment": "/blog/chronic-fatigue-ayurvedic-treatment-ojas",
  "Ojas recovery": "/blog/chronic-fatigue-ayurvedic-treatment-ojas",
  "diabetes treatment": "/blog/diabetes-ayurvedic-treatment-bloodsugar",
  "blood sugar control": "/blog/diabetes-ayurvedic-treatment-bloodsugar",
  "fatty liver treatment": "/blog/fatty-liver-ayurvedic-treatment-diet",
  "piles treatment kshara": "/blog/hemorrhoids-piles-ayurvedic-treatment-kshara",
  "hemorrhoids treatment": "/blog/hemorrhoids-piles-ayurvedic-treatment-kshara",
  "pigmentation treatment": "/blog/melasma-pigmentation-ayurvedic-treatment",
  "melasma care": "/blog/melasma-pigmentation-ayurvedic-treatment",
  "menopause treatment": "/blog/menopause-ayurvedic-treatment-hot-flashes",
  "hot flashes relief": "/blog/menopause-ayurvedic-treatment-hot-flashes",
  "psoriasis treatment": "/blog/psoriasis-ayurvedic-treatment-kitibha",
  "Kitibha care": "/blog/psoriasis-ayurvedic-treatment-kitibha",
  "constipation remedies": "/blog/severe-constipation-ayurvedic-remedies"
};

export function injectInternalLinks(htmlContent: string): string {
  // Sort keywords by length descending to match longer phrases first
  const sortedKeywords = Object.keys(KEYWORD_DICT).sort((a, b) => b.length - a.length);
  
  // To avoid linking the same URL multiple times in one post, preserving the "Wikipedia" style
  const linkedUrls = new Set<string>();
  let linkedCount = 0;

  // Split HTML into text nodes and HTML tags
  const tokenRegex = /(<a\b[^>]*>.*?<\/a>|<[^>]+>)/ig;
  
  let tokens = htmlContent.split(tokenRegex);

  for (const keyword of sortedKeywords) {
    const url = KEYWORD_DICT[keyword];
    
    // Skip if we already linked to this URL or reached the limit of 6 links per article
    if (linkedUrls.has(url) || linkedCount >= 6) continue;

    // Use a case-insensitive regex for the keyword bounded by word boundaries
    const keywordRegex = new RegExp(`\\b(${keyword})\\b`, 'i');

    // Only iterate over text tokens
    for (let i = 0; i < tokens.length; i += 2) {
      if (keywordRegex.test(tokens[i])) {
        // Replace ONLY the first occurrence in the text block to avoid over-linking
        tokens[i] = tokens[i].replace(
          keywordRegex,
          (match) => `<a href="${url}" class="text-green-600 font-semibold hover:underline" title="Read more about ${match}">${match}</a>`
        );
        linkedUrls.add(url);
        linkedCount++;
        break; // Stop after replacing the first occurrence of this keyword in the entire document
      }
    }
  }

  return tokens.join('');
}
