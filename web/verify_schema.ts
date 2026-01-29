import { generateSchema } from "./lib/schema-generator";
import { blogPosts } from "./lib/blog-data";

// Test with the first post
const post = blogPosts[0];
console.log("Testing Schema for:", post.slug);

const schema = generateSchema(post);
console.log(JSON.stringify(schema, null, 2));

// Test FAQ extraction specifically
// Find a post with clear FAQs (e.g. Seasonal Detox)
const detoxPost = blogPosts.find(p => p.slug.includes("seasonal"));
if (detoxPost) {
    console.log("\nTesting FAQ Extraction for Detox:");
    const detoxSchema = generateSchema(detoxPost);
    // Print only the FAQ part
    const faqPart = detoxSchema["@graph"].find(x => x["@type"] === "FAQPage");
    console.log(JSON.stringify(faqPart, null, 2));
}
