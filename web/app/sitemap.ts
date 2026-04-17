import type { MetadataRoute } from "next"
import { blogPosts } from "@/lib/blog-data"
import { targetLocations } from "@/lib/locations"

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://www.ayureva.in"
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
        {
            url: `${baseUrl}/mobile-app`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${baseUrl}/ayurveda-suggestions`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.6,
        },
    ]

    // 2. Dynamic Blog Routes
    const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.publishDate ? new Date(post.publishDate) : currentDate,
        changeFrequency: "monthly",
        priority: 0.8,
    }))

    // 3. Programmatic Location Pages (pSEO)
    const locationRoutes: MetadataRoute.Sitemap = targetLocations.map((loc) => ({
        url: `${baseUrl}/online-pcod-treatment/${loc.id}`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.7,
    }))

    return [...staticRoutes, ...blogRoutes, ...locationRoutes]
}
