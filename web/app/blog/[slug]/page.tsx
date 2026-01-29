import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { blogPosts } from "@/lib/blog-data"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, ShieldCheck, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BlogPostPageProps {
    params: Promise<{
        slug: string
    }>
}

// Generate static params for all blog posts
export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
    const { slug } = await params
    const post = blogPosts.find((p) => p.slug === slug)
    if (!post) return { title: "Article Not Found" }

    return {
        title: `${post.title} | Dr. Arti Singh - Ayureva`,
        description: post.excerpt,
        alternates: {
            canonical: `/blog/${slug}`,
        },
        openGraph: {
            type: "article",
            title: post.title,
            description: post.excerpt,
            publishedTime: post.publishDate,
            authors: [post.author],
        },
    }
}

import { generateSchema } from "@/lib/schema-generator"

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params
    const post = blogPosts.find((p) => p.slug === slug)

    if (!post) {
        notFound()
    }

    const jsonLd = generateSchema(post)

    return (
        <div className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Progress Bar (Optional - could be added later) */}

            <div className="container mx-auto px-4 py-12">
                <Link
                    href="/blog"
                    className="inline-flex items-center text-green-600 font-medium mb-8 hover:underline hover:text-green-700"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Articles
                </Link>

                <div className="grid lg:grid-cols-[1fr_300px] gap-12">
                    {/* Main Content Column */}
                    <article className="max-w-3xl">
                        <header className="mb-8">
                            {/* Featured Image */}
                            {post.image && (
                                <div className="relative w-full h-[300px] md:h-[400px] mb-8 rounded-2xl overflow-hidden shadow-sm">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            )}

                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mb-4">{post.category}</Badge>
                            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

                            <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm border-b border-gray-100 pb-8">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span className="font-medium text-gray-900">{post.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{post.publishDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{post.readTime}</span>
                                </div>
                                <div className="flex items-center gap-2 text-green-600">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Medically Reviewed</span>
                                </div>
                            </div>
                        </header>

                        {/* Content Body */}
                        <div
                            className="prose prose-lg prose-green max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Author Bio Box */}
                        <div className="mt-16 bg-gray-50 rounded-2xl p-8 border border-gray-100 flex gap-6 items-start">
                            <div className="w-16 h-16 rounded-full bg-green-200 flex-shrink-0 flex items-center justify-center text-2xl font-bold text-green-800">
                                DA
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">About Dr. Arti Singh (BAMS)</h4>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    Dr. Arti Singh is a licensed Ayurvedic physician specializing in women's health, PCOS, and hormonal
                                    disorders. With a focus on evidence-based Ayurveda, she helps patients achieve remission through
                                    natural therapies and lifestyle management.
                                </p>
                                <Link href="/about" className="text-green-600 font-semibold text-sm hover:underline">
                                    View Full Profile &rarr;
                                </Link>
                            </div>
                        </div>
                    </article>

                    {/* Mobile/Bottom CTA */}
                    <div className="lg:hidden mb-12 bg-green-50 rounded-xl p-6 border border-green-100 text-center">
                        <h3 className="text-lg font-bold text-green-900 mb-2">Interested in Ayurveda?</h3>
                        <p className="text-sm text-green-700 mb-4">Discover how personalized Ayurvedic care can help your specific condition.</p>
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white" asChild>
                            <Link href="/contact">View Consultation Options</Link>
                        </Button>
                    </div>

                    {/* Sidebar CTA (Sticky) */}
                    <aside className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Personal Guidance</h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                Every body type (Prakriti) is unique. Explore a customized approach for your wellness journey.
                            </p>

                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                    In-depth Constitution Analysis
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                    Personalized Diet Plan
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                    1-on-1 Discussion
                                </li>
                            </ul>

                            <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20" asChild>
                                <Link href="/contact">Check Availability</Link>
                            </Button>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                Professional • Confidential
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
