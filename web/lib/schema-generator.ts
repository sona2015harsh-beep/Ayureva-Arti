import { BlogPost } from "./blog-data"

export function generateSchema(post: BlogPost) {
    // 1. Base MedicalWebPage Schema
    const medicalSchema = {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        "name": post.title,
        "description": post.excerpt,
        "image": post.image,
        "datePublished": post.publishDate,
        "author": {
            "@type": "Physician",
            "name": "Dr. Arti Singh",
            "jobTitle": "BAMS (Ayurvedic Physician)",
            "url": "https://ayureva.com/about"
        },
        "audience": {
            "@type": "Patient",
            "audienceType": "Health Conscious Individuals"
        },
        "specialty": "Ayurveda",
        "reviewedBy": {
            "@type": "Physician",
            "name": "Dr. Arti Singh"
        }
    }

    // 2. Extract FAQs
    const faqSchema = extractFAQs(post.content);

    // 3. Combine into a Graph
    const graph = {
        "@context": "https://schema.org",
        "@graph": [
            medicalSchema,
            ...(faqSchema ? [faqSchema] : [])
        ]
    }

    return graph
}

function extractFAQs(htmlContent: string) {
    const faqs = []

    // Use a regex that matches either H4 or H5 tag for the question
    // and then finds the P tag for the answer.
    const simpleRegex = /<h[45][^>]*>(.*?)<\/h[45]>\s*<p[^>]*>(.*?)<\/p>/g;

    let match;
    while ((match = simpleRegex.exec(htmlContent)) !== null) {
        const question = match[1].replace(/^\d+\.\s*/, "").replace(/<[^>]*>/g, "").trim(); // Remove "1. " and tags
        const answer = match[2].replace(/<[^>]*>/g, "").trim();

        // Filter: Include if it has a "?" or starts with a number (common pattern)
        // or if the length is substantial enough to be a question.
        // Also ensuring the question text isn't "Medical Disclaimer" or similar.

        if ((question.includes("?") || match[1].match(/^\d+\./)) && !question.includes("Disclaimer")) {
            faqs.push({
                "@type": "Question",
                "name": question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": answer
                }
            })
        }
    }

    if (faqs.length === 0) return null;

    return {
        "@type": "FAQPage",
        "mainEntity": faqs
    }
}
