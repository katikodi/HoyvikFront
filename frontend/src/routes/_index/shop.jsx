import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_index/shop")({
    component: ShopPage
});

function ShopPage() {
    return (
        <div className="w-full h-full flex flex-col bg-secondary pt-24 items-center">
            <div className="grid grid-cols-3 gap-2 pt-24">
                <ProductCard
                    img="/images/fake-producs/leaf-nightlight.webp"
                    altText="leaf nightlight"
                    title="Leaf Nightlight"
                    desc="a nightlight that looks like a leaf and plugs right into the socket. perfect for cozy autumn vibes"
                />
                <ProductCard
                    img="/images/fake-producs/leaf-nightlight.webp"
                    altText="leaf nightlight"
                    title="Leaf Nightlight"
                    desc="a nightlight that looks like a leaf and plugs right into the socket. perfect for cozy autumn vibes"
                />
                <ProductCard
                    img="/images/fake-producs/leaf-nightlight.webp"
                    altText="leaf nightlight"
                    title="Leaf Nightlight"
                    desc="a nightlight that looks like a leaf and plugs right into the socket. perfect for cozy autumn vibes"
                />
                <ProductCard
                    img="/images/fake-producs/leaf-nightlight.webp"
                    altText="leaf nightlight"
                    title="Leaf Nightlight"
                    desc="a nightlight that looks like a leaf and plugs right into the socket. perfect for cozy autumn vibes"
                />
                <ProductCard
                    img="/images/fake-producs/leaf-nightlight.webp"
                    altText="leaf nightlight"
                    title="Leaf Nightlight"
                    desc="a nightlight that looks like a leaf and plugs right into the socket. perfect for cozy autumn vibes"
                />
            </div>
        </div>
    );
}

const ProductCard = ({ img, altText, title, desc }) => {
    return (
        <Card className="w-md aspect-square rounded-none bg-background text-seafoam-green">
            <img
                src={img}
                alt={altText}
                className="relative z-20 aspect-video w-full object-cover object-[25%_20%] center rounded-none"
            />
            <CardHeader>
                <CardAction>
                    <Badge
                        variant="default"
                        className="bg-orange-400"
                    >
                        Halloween
                    </Badge>
                </CardAction>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="text-seafoam-green">{desc}</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button className="w-full rounded-none">Buy Now!</Button>
            </CardFooter>
        </Card>
    );
};
