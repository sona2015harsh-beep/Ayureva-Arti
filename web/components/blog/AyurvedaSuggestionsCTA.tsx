import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShoppingBag } from "lucide-react";
import { affiliateProducts } from "@/lib/data/affiliate-products";
import { AffiliateProductCard } from "@/components/AffiliateProductCard";

interface AyurvedaSuggestionsCTAProps {
    category?: string;
    tags?: string[];
}

export function AyurvedaSuggestionsCTA({ category, tags }: AyurvedaSuggestionsCTAProps) {
    // Enhanced Relevance Scoring Logic
    // Score = (Tag Match * 10) + (Category Match * 5)

    const scoredProducts = affiliateProducts.map(product => {
        let score = 0;

        // 1. Tag Scoring (+10 per match)
        if (tags && product.tags) {
            const productTags = product.tags.map(t => t.toLowerCase());
            tags.forEach(blogTag => {
                if (productTags.some(pt => pt.includes(blogTag.toLowerCase()) || blogTag.toLowerCase().includes(pt))) {
                    score += 10;
                }
            });
        }

        // 2. Category Scoring (+5)
        if (category && product.category.toLowerCase().includes(category.toLowerCase())) {
            score += 5;
        }

        // 3. Fallback: Title Keyword Match (+2)
        if (tags) {
            tags.forEach(blogTag => {
                if (product.name.toLowerCase().includes(blogTag.toLowerCase())) {
                    score += 2;
                }
            });
        }

        return { product, score };
    });

    // Filter out zero scores if we have enough matches, otherwise keep them for potential fallback
    let relevantProducts = scoredProducts
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.product);

    // If fewer than 3 relevant matches, fill with "Best Sellers" to ensure grid is full
    if (relevantProducts.length < 3) {
        const bestSellers = affiliateProducts.filter(p => p.highlight === "Best Seller" || (p.rating || 0) >= 4.5);
        for (const product of bestSellers) {
            if (relevantProducts.length >= 3) break;
            if (!relevantProducts.find(p => p.id === product.id)) {
                relevantProducts.push(product);
            }
        }
    }

    // Final fallback to fill the grid randomly/sequentially if still empty
    if (relevantProducts.length < 3) {
        for (const product of affiliateProducts) {
            if (relevantProducts.length >= 3) break;
            if (!relevantProducts.find(p => p.id === product.id)) {
                relevantProducts.push(product);
            }
        }
    }

    // Use only top 3
    const displayProducts = relevantProducts.slice(0, 3);

    return (
        <div className="my-16 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-green-500 pl-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ShoppingBag className="h-6 w-6 text-green-600" />
                        Recommended for {category ? category : "You"}
                    </h3>
                    <p className="text-gray-600 mt-1">
                        Curated Ayurvedic medicines and supplements relative to this topic.
                    </p>
                </div>
                <Button asChild variant="outline" className="shrink-0 border-green-200 text-green-700 hover:bg-green-50">
                    <Link href="/ayurveda-suggestions" className="flex items-center gap-2">
                        View All Products <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {displayProducts.map(product => (
                    <div key={product.id} className="h-full">
                        <AffiliateProductCard product={product} />
                    </div>
                ))}
            </div>

            <div className="bg-green-50 rounded-lg p-4 flex items-start gap-3 text-sm text-green-800 border border-green-100">
                <Sparkles className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <p>
                    <strong>Why these suggestions?</strong> We verify all listed products for authenticity and quality.
                    When you buy through our links, we may earn a small commission that supports this blog.
                </p>
            </div>
        </div>
    );
}
