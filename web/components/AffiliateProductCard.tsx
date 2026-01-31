import { AffiliateProduct } from "@/lib/data/affiliate-products";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star } from "lucide-react";
import Image from "next/image";

interface AffiliateProductCardProps {
    product: AffiliateProduct;
}

export function AffiliateProductCard({ product }: AffiliateProductCardProps) {
    return (
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 w-full bg-gray-50">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {product.highlight && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600 text-white border-0">
                        {product.highlight}
                    </Badge>
                )}
            </div>

            <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start mb-1">
                    <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                        {product.category}
                    </Badge>
                    {product.brand && (
                        <span className="text-xs text-muted-foreground font-medium">{product.brand}</span>
                    )}
                </div>
                <h3 className="font-semibold text-lg leading-tight line-clamp-2 min-h-[3rem]">
                    {product.name}
                </h3>
            </CardHeader>

            <CardContent className="p-4 flex-grow">
                <div className="flex items-center mb-3 space-x-1">
                    {product.rating && (
                        <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="ml-1 text-sm font-medium text-foreground">{product.rating}</span>
                        </div>
                    )}
                    {product.reviews && (
                        <span className="text-xs text-muted-foreground">
                            ({product.reviews} reviews)
                        </span>
                    )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">
                    {product.description}
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between">
                <div className="text-lg font-bold text-primary">
                    {product.price || "Check Price"}
                </div>
                <Button asChild size="sm" className="gap-2">
                    <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer">
                        Buy Now <ExternalLink className="w-4 h-4" />
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
}
