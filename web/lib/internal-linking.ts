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
  
  // Blog specific long-tail keywords
  "PCOS vs PCOD": "/blog/pcod-vs-pcos-ayurvedic-difference",
  "Ayurvedic diet": "/blog/ayurvedic-diet-for-pcos",
  "PCOS diet": "/blog/ayurvedic-diet-for-pcos",
  "hormonal imbalance": "/blog/ayurvedic-diet-hormonal-imbalance",
  "female infertility": "/blog/ayurvedic-infertility-treatment-egg-quality",
  "egg quality": "/blog/ayurvedic-infertility-treatment-egg-quality",
  "endometriosis": "/blog/ayurvedic-management-endometriosis",
  "thyroid disorders": "/blog/ayurvedic-thyroid-treatment",
  "UTI treatment": "/blog/chronic-uti-ayurvedic-treatment",
  "heavy bleeding": "/blog/heavy-menstrual-bleeding-ayurveda",
  "irregular periods": "/blog/ayurvedic-remedies-irregular-periods",
  "Panchakarma": "/blog/panchakarma-for-hormonal-balance",
  "Shatavari": "/blog/shatavari-benefits-womens-health",
  "Ashoka tree": "/blog/ashoka-herb-benefits",
  "Kanchanar Guggulu": "/blog/kanchanar-guggulu-pcos",
  "insulin resistance": "/blog/insulin-resistance-pcos-ayurveda",
  "weight loss": "/blog/ayurvedic-weight-loss-pcos",
  "Vata imbalance": "/blog/understanding-vata-dosha",
  "Pitta imbalance": "/blog/understanding-pitta-dosha",
  "Kapha imbalance": "/blog/understanding-kapha-dosha",
  "digestive fire": "/blog/agni-digestive-fire-ayurveda",
  "Ama (toxins)": "/blog/ama-toxins-ayurveda",
  "Dinacharya": "/blog/dinacharya-ayurvedic-daily-routine",
  "Ritucharya": "/blog/ritucharya-seasonal-routine",
};

export function injectInternalLinks(htmlContent: string): string {
  // Sort keywords by length descending to match longer phrases first
  const sortedKeywords = Object.keys(KEYWORD_DICT).sort((a, b) => b.length - a.length);
  
  // To avoid linking the same URL multiple times in one post, preserving the "Wikipedia" style
  const linkedUrls = new Set<string>();

  // Split HTML into text nodes and HTML tags
  // This regex matches complete <a> tags including their content, OR any other HTML tag
  // We only want to replace text outside of HTML tags and completely ignore existing anchor tags
  const tokenRegex = /(<a\b[^>]*>.*?<\/a>|<[^>]+>)/ig;
  
  let tokens = htmlContent.split(tokenRegex);

  for (const keyword of sortedKeywords) {
    const url = KEYWORD_DICT[keyword];
    
    // Skip if we already linked to this URL in this document
    if (linkedUrls.has(url)) continue;

    // Use a case-insensitive regex for the keyword bounded by word boundaries
    // Note: this may have edge cases with punctuation, but is generally safe
    const keywordRegex = new RegExp(`\\b(${keyword})\\b`, 'i');

    // Only iterate over text tokens (these are at even indices based on how split works with capturing groups)
    for (let i = 0; i < tokens.length; i += 2) {
      if (keywordRegex.test(tokens[i])) {
        // Replace ONLY the first occurrence in the text block to avoid over-linking
        tokens[i] = tokens[i].replace(
          keywordRegex,
          (match) => `<a href="${url}" class="text-green-600 font-semibold hover:underline" title="Read more about ${match}">${match}</a>`
        );
        linkedUrls.add(url);
        break; // Stop after replacing the first occurrence of this keyword in the entire document
      }
    }
  }

  return tokens.join('');
}
