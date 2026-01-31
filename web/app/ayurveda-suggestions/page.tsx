import { affiliateProducts } from "@/lib/data/affiliate-products";
import { AffiliateProductCard } from "@/components/AffiliateProductCard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Best Ayurveda Medicines & Recommendations | Ayurveda Suggestions",
    description: "Explore our curated list of top-rated Ayurveda medicines, supplements, and wellness products for immunity, digestion, and stress relief.",
};

export default function AyurvedaSuggestionsPage() {
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl mb-4 text-green-900">
                    Ayurveda Recommendations
                </h1>
                <p className="text-xl text-muted-foreground text-center text-green-700">
                    Hand-picked authentic Ayurvedic medicines and wellness products to support your holistic lifestyle.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {affiliateProducts.map((product) => (
                    <div key={product.id} className="h-full">
                        <AffiliateProductCard product={product} />
                    </div>
                ))}
            </div>

            <div className="mt-16 text-center text-sm text-muted-foreground bg-muted/30 p-6 rounded-lg max-w-2xl mx-auto border border-green-100 bg-green-50">
                <p>
                    <strong>Disclaimer:</strong> We may earn a small commission when you purchase through our links, at no extra cost to you.
                    Please consult with a qualified Ayurvedic practitioner before starting any new supplement regimen.
                </p>
            </div>
        </div>
    );
}
