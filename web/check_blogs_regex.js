
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib/blog-data.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Regex to find slugs
const slugRegex = /slug:\s*"([^"]+)"/g;
let match;
const slugs = [];
while ((match = slugRegex.exec(content)) !== null) {
    slugs.push({ slug: match[1], index: match.index });
}

console.log(`Found ${slugs.length} slugs.`);

slugs.forEach((item, i) => {
    // Find the content for this slug
    // We look for the "content:" field after the slug
    // This is a rough heuristic
    const nextSlugIndex = slugs[i + 1] ? slugs[i + 1].index : content.length;
    const postBlock = content.substring(item.index, nextSlugIndex);

    const hasDisclaimer = postBlock.includes('Medical Disclaimer');
    const length = postBlock.length;
    const isExpanded = length > 2000;

    console.log(`${i + 1}. ${item.slug.padEnd(50)} | Length: ${length.toString().padEnd(6)} | Disclaimer: ${hasDisclaimer ? 'YES' : 'NO '} | Expanded: ${isExpanded ? 'YES' : 'NO'}`);
});
