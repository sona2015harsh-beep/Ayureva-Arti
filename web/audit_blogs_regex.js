
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib/blog-data.ts');
console.log(`Auditing file: ${filePath}`);

const fileContent = fs.readFileSync(filePath, 'utf8');

// Regex to capture content inside content: `...` ticks
const blogRegex = /slug:\s*"([^"]+)"[\s\S]*?content:\s*`([\s\S]*?)`/g;

let match;
const results = [];

console.log('---------------------------------------------------');
console.log('AUDIT REPORT: 1800+ Words & Compliance Check');
console.log('---------------------------------------------------');

let count = 0;
while ((match = blogRegex.exec(fileContent)) !== null) {
    count++;
    const slug = match[1];
    const content = match[2];

    // Strip tags
    const cleanText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = cleanText.split(' ').length;

    // Checks
    const hasDisclaimer = content.includes('Medical Disclaimer');
    const hasAuthor = content.includes('Dr. Arti Singh');
    const pass = wordCount >= 1800;

    results.push({ slug, wordCount, hasDisclaimer, hasAuthor, pass });
}

console.log(`Total Scanned: ${count}`);

console.table(results.map(r => ({
    Slug: r.slug.substring(0, 30),
    Words: r.wordCount,
    'Disclaimer?': r.hasDisclaimer ? 'YES' : 'NO',
    'Author?': r.hasAuthor ? 'YES' : 'NO',
    'PASS?': r.pass ? 'PASS' : 'FAIL'
})));

const failed = results.filter(r => !r.pass);
if (failed.length > 0) {
    console.log('\n❌ FAILED POSTS (< 1800 Words):');
    failed.forEach(r => console.log(`- ${r.slug}: ${r.wordCount} words`));
} else {
    console.log('\n✅ ALL POSTS PASSED WORD COUNT AUDIT.');
}
