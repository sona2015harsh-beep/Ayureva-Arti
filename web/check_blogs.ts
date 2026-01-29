
import { blogPosts } from './lib/blog-data';

console.log(`Total Posts: ${blogPosts.length}`);
console.log('--- Post Status ---');

let expandedCount = 0;
let placeholderCount = 0;

blogPosts.forEach((post, index) => {
    const isExpanded = post.content.length > 2000; // Arbitrary threshold for "expanded"
    if (isExpanded) expandedCount++;
    else placeholderCount++;

    console.log(`${index + 1}. [${isExpanded ? 'EXPANDED' : 'SHORT   '}] ${post.slug} (${post.content.length} chars)`);
});

console.log('-------------------');
console.log(`Expanded: ${expandedCount}`);
console.log(`Short/Placeholder: ${placeholderCount}`);
