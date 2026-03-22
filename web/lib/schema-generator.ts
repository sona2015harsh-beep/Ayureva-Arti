import { BlogPost } from "./blog-data"

export function generateSchema(post: BlogPost) {
    // 1. Base MedicalWebPage Schema with Speakable & Abstract
    const medicalSchema: Record<string, unknown> = {
        "@type": "MedicalWebPage",
        "name": post.title,
        "description": post.excerpt,
        "abstract": post.quickAnswer,
        "image": post.image,
        "datePublished": post.publishDate,
        "dateModified": post.publishDate,
        "author": {
            "@type": "Physician",
            "name": "Dr. Arti Singh",
            "jobTitle": "BAMS (Ayurvedic Physician)",
            "url": "https://www.ayureva.in/about"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Ayureva",
            "url": "https://www.ayureva.in",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.ayureva.in/logo.png"
            }
        },
        "audience": {
            "@type": "Patient",
            "audienceType": "Health Conscious Individuals"
        },
        "specialty": "Ayurveda",
        "reviewedBy": {
            "@type": "Physician",
            "name": "Dr. Arti Singh"
        },
        // Speakable schema - tells Google what to read aloud / extract for AI Overview
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["#short-answer", "h1", "#faq-section"]
        }
    }

    // 2. BreadcrumbList Schema
    const breadcrumbSchema = {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.ayureva.in"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://www.ayureva.in/blog"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `https://www.ayureva.in/blog/${post.slug}`
            }
        ]
    }

    // 3. Article Schema (for Google Discover & News)
    const articleSchema = {
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.image ? `https://www.ayureva.in${post.image}` : undefined,
        "datePublished": post.publishDate,
        "dateModified": post.publishDate,
        "author": {
            "@type": "Person",
            "name": "Dr. Arti Singh (BAMS)",
            "url": "https://www.ayureva.in/about"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Ayureva",
            "url": "https://www.ayureva.in"
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.ayureva.in/blog/${post.slug}`
        }
    }

    // 4. Extract FAQs
    const faqSchema = extractFAQs(post.content);

    // 5. Combine into a Graph
    const graph = {
        "@context": "https://schema.org",
        "@graph": [
            medicalSchema,
            breadcrumbSchema,
            articleSchema,
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
