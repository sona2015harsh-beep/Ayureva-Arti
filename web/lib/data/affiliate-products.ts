export interface AffiliateProduct {
    id: string;
    name: string;
    description: string;
    category: string;
    imageUrl: string;
    price?: string;
    affiliateLink: string;
    brand?: string;
    rating?: number;
    reviews?: number;
    highlight?: string; // e.g. "Best Seller", "Editor's Choice"
    tags?: string[]; // keywords for context matching
}

export const affiliateProducts: AffiliateProduct[] = [
    {
        id: "1",
        name: "Ayurvedic Care for White Discharge (Leucorrhea)",
        description: "Natural herbal support for women's intimate health, designed to balance pH and control white discharge.",
        category: "Women's Health",
        imageUrl: "https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=800",
        price: "Check Price",
        affiliateLink: "https://amzn.to/3OgUhre",
        brand: "Ayurvedic Care",
        rating: 4.6,
        reviews: 320,
        highlight: "Highly Recommended",
        tags: ["white discharge", "leucorrhea", "women's health", "infection", "hygiene"]
    },
    {
        id: "2",
        name: "Ayurvedic Thyroid Care Supplement",
        description: "Natural support for Thyroid function (TSH balance). Formulated with Kanchanar Guggulu and other potent herbs.",
        category: "Women's Health",
        imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
        price: "Check Price",
        affiliateLink: "https://amzn.to/3M4AdYD",
        brand: "Ayurvedic Care",
        rating: 4.4,
        reviews: 410,
        highlight: "Thyroid Specialist",
        tags: ["thyroid", "tsh", "hormones", "weight loss", "metabolism", "women's health"]
    }
];

export const allCategories = Array.from(new Set(affiliateProducts.map(p => p.category)));
