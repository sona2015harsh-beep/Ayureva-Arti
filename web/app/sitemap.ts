import type { MetadataRoute } from "next"
import { blogPosts } from "@/lib/blog-data"

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://ayureva.in"
    const currentDate = new Date()

    // 1. Static Routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: currentDate,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: currentDate,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms-conditions`,
            lastModified: currentDate,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/refund-policy`,
            lastModified: currentDate,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/disclaimer`,
            lastModified: currentDate,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/pcod-ayurvedic-treatment-online`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.9,
        },
    ]

    // 2. Dynamic Blog Routes
    const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.publishDate ? new Date(post.publishDate) : currentDate,
        changeFrequency: "monthly",
        priority: 0.8,
    }))

    return [...staticRoutes, ...blogRoutes]
}
