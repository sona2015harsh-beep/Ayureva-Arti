
import { blogPosts } from './lib/blog-data';
import * as fs from 'fs';

console.log('Starting Comprehensive Blog Audit...');
console.log('Target: 1800+ Words per post');
console.log('---------------------------------------------------');

const results: any[] = [];

blogPosts.forEach((post, index) => {
    // Strip HTML to get raw text for word count
    const rawText = post.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = rawText.split(' ').length;

    // Check Rules
    const hasDisclaimer = post.content.includes('Medical Disclaimer');
    const hasAuthor = post.content.includes('Dr. Arti Singh') || post.author.includes('Dr. Arti Singh');
    const hasStructure = post.content.includes('<h2') && post.content.includes('<ul'); // Basic check for structure
    const isLengthCompliant = wordCount >= 1800;

    results.push({
        id: index + 1,
        slug: post.slug,
        wordCount: wordCount,
        hasDisclaimer: hasDisclaimer,
        hasAuthor: hasAuthor,
        status: isLengthCompliant ? 'PASS' : 'FAIL'
    });
});

// Output Table
console.table(results.map(r => ({
    Slug: r.slug.substring(0, 30) + '...',
    Words: r.wordCount,
    Disclaimer: r.hasDisclaimer ? '✅' : '❌',
    Author: r.hasAuthor ? '✅' : '❌',
    Status: r.status
})));

// Summary
const failed = results.filter(r => r.status === 'FAIL');
console.log('---------------------------------------------------');
console.log(`Total Posts: ${blogPosts.length}`);
console.log(`Passed: ${blogPosts.length - failed.length}`);
console.log(`Failed: ${failed.length}`);

if (failed.length > 0) {
    console.log('\nFailed Posts (< 1800 Words):');
    failed.forEach(p => console.log(`- ${p.slug}: ${p.wordCount} words`));
}
