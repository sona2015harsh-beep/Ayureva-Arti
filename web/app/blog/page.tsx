import Link from "next/link"
import Image from "next/image"
import { blogPosts } from "@/lib/blog-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight } from "lucide-react"

export const metadata = {
    title: "Ayurveda Health Blog | Expert Insights by Dr. Arti Singh",
    description:
        "Read expert articles on Ayurveda, PCOS, women's health, and holistic living. Educational insights from Dr. Arti Singh (BAMS) to help you heal naturally.",
    alternates: {
        canonical: "/blog",
    },
}

export default function BlogListingPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Section */}
            <div className="bg-green-900 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="bg-green-700 text-green-100 mb-4 hover:bg-green-700">Health & Wellness Journal</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Ayurvedic Insights</h1>
                    <p className="text-xl text-green-100 max-w-2xl mx-auto">
                        Expert educational articles to separate myths from facts. Real Ayurvedic knowledge for modern women's
                        health.
                    </p>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <div
                            key={post.slug}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="h-48 bg-green-50 relative overflow-hidden group">
                                {post.image ? (
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-green-100 flex items-center justify-center text-green-800/20">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="64"
                                            height="64"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                                    <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                                        {post.category}
                                    </Badge>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {post.readTime}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 hover:text-green-700 transition-colors">
                                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                </h2>

                                <p className="text-gray-600 mb-6 line-clamp-3 text-sm flex-1">{post.excerpt}</p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-800">
                                            DA
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Dr. Arti Singh</span>
                                    </div>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="text-green-600 font-semibold text-sm flex items-center hover:underline"
                                    >
                                        Read <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Newsletter / CTA Section */}
            <div className="container mx-auto px-4 mt-8">
                <div className="bg-green-50 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-green-900 mb-4">Start Your Healing Journey</h3>
                    <p className="text-gray-700 mb-8 max-w-xl mx-auto">
                        Ayurveda is a journey, not a destination. If you're looking for personalized guidance for persistent health
                        issues, Dr. Arti is here to help.
                    </p>
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" asChild>
                        <Link href="/contact">Book a Consultation</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
