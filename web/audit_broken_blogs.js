const fs = require('fs');
const content = fs.readFileSync('./lib/blog-data.ts', 'utf8');

// Find each blog post's content section and check for common issues
const postRegex = /{\s*slug:\s*["']([^"']+)["'],\s*title:\s*["']([^"']+)["'][\s\S]*?content:\s*`([\s\S]*?)`,?\s*},?/g;

let issues = [];
let match;
let totalPosts = 0;

while ((match = postRegex.exec(content)) !== null) {
  totalPosts++;
  const slug = match[1];
  const title = match[2];
  const blogContent = match[3];
  
  let postIssues = [];
  
  // Check for unclosed HTML tags (common patterns)
  const openDivs = (blogContent.match(/<div/g) || []).length;
  const closeDivs = (blogContent.match(/<\/div>/g) || []).length;
  if (openDivs !== closeDivs) {
    postIssues.push(`Mismatched div tags (open: ${openDivs}, close: ${closeDivs})`);
  }
  
  // Check for unclosed p tags
  const openP = (blogContent.match(/<p[\s>]/g) || []).length;
  const closeP = (blogContent.match(/<\/p>/g) || []).length;
  if (Math.abs(openP - closeP) > 2) {
    postIssues.push(`Mismatched p tags (open: ~${openP}, close: ${closeP})`);
  }
  
  // Check for unclosed ul/li tags
  const openUl = (blogContent.match(/<ul/g) || []).length;
  const closeUl = (blogContent.match(/<\/ul>/g) || []).length;
  if (openUl !== closeUl) {
    postIssues.push(`Mismatched ul tags (open: ${openUl}, close: ${closeUl})`);
  }
  
  // Check for template literal issues
  if (blogContent.includes('${')) {
    postIssues.push('Contains unescaped template literal ${...}');
  }
  
  // Check for visible HTML entities that should be rendered
  if (blogContent.includes('&lt;') || blogContent.includes('&gt;')) {
    postIssues.push('Contains literal HTML entities that may render as code');
  }
  
  // Check for backtick issues inside content that could break the template
  const inlineBackticks = blogContent.match(/[^\\]`/g) || [];
  if (inlineBackticks.length > 0) {
    postIssues.push(`Contains unescaped backticks (${inlineBackticks.length} found) - LIKELY BROKEN`);
  }

  // Check for broken closing tags pattern like </h2 > or < /p>
  const brokenTags = blogContent.match(/<\s*\/\s*[a-z]+\s*>/gi) || [];
  const brokenOpenTags = blogContent.match(/<\s+[a-z]+/gi) || [];
  if (brokenTags.length > 0 || brokenOpenTags.length > 0) {
    postIssues.push(`Broken tag syntax found`);
  }

  // Check for visible JSX-like expressions that shouldn't render
  const jsxExpressions = blogContent.match(/\{[a-zA-Z_][a-zA-Z0-9_]*\}/g) || [];
  if (jsxExpressions.length > 5) {
    postIssues.push(`Suspicious JSX expressions: ${jsxExpressions.slice(0,5).join(', ')}`);
  }

  // Check for unclosed table tags
  const openTable = (blogContent.match(/<table/g) || []).length;
  const closeTable = (blogContent.match(/<\/table>/g) || []).length;
  if (openTable !== closeTable) {
    postIssues.push(`Mismatched table tags (open: ${openTable}, close: ${closeTable})`);
  }

  // Check for unclosed h2/h3 tags
  const openH2 = (blogContent.match(/<h2/g) || []).length;
  const closeH2 = (blogContent.match(/<\/h2>/g) || []).length;
  if (openH2 !== closeH2) {
    postIssues.push(`Mismatched h2 tags (open: ${openH2}, close: ${closeH2})`);
  }

  const openH3 = (blogContent.match(/<h3/g) || []).length;
  const closeH3 = (blogContent.match(/<\/h3>/g) || []).length;
  if (openH3 !== closeH3) {
    postIssues.push(`Mismatched h3 tags (open: ${openH3}, close: ${closeH3})`);
  }

  // Check for very short content (might be incomplete)
  if (blogContent.length < 1000) {
    postIssues.push(`Content suspiciously short (${blogContent.length} chars)`);
  }

  // Check for weird characters or encoding issues
  if (blogContent.includes('â€') || blogContent.includes('Ã')) {
    postIssues.push('Contains encoding/character issues');
  }

  if (postIssues.length > 0) {
    issues.push({ slug, title: title.substring(0, 60), issues: postIssues });
  }
}

console.log('\n=== BLOG AUDIT RESULTS ===\n');
console.log(`Total posts scanned: ${totalPosts}\n`);

if (issues.length === 0) {
  console.log('✅ No obvious issues found in blog content.');
} else {
  console.log(`⚠️  Found ${issues.length} blog posts with potential issues:\n`);
  issues.forEach((item, i) => {
    console.log(`${i+1}. ${item.slug}`);
    console.log(`   Title: ${item.title}...`);
    item.issues.forEach(issue => {
      console.log(`   ⚠️  ${issue}`);
    });
    console.log('');
  });
}
