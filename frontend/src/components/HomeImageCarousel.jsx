import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomeImageCarousel() {
    const cards = [
        { title: "Rom 1", description: "Ett rom", image: "/images/rom1.webp" },
        { title: "Rom 2", description: "Enda ett rom", image: "/images/rom1.webp" },
        { title: "Rom 3", description: "Rom", image: "/images/rom1.webp" }
    ];

    return (
        <section className="flex flex-row justify-center gap-4 bg-secondary px-12 pt-40">
            {cards.map((card, i) => (
                <Card
                    key={i}
                    className="grow rounded-none bg-light-background pt-0"
                >
                    <img
                        src={card.image}
                        alt={`${card.title} cover`}
                        className="relative z-20 aspect-video w-full rounded-none object-cover"
                    />

                    <CardHeader>
                        <CardAction>
                            <Badge
                                variant="secondary"
                                className="rounded-none"
                            >
                                Featured
                            </Badge>
                        </CardAction>

                        <CardTitle>{card.title}</CardTitle>
                        <CardDescription className="text-brown">{card.description}</CardDescription>
                    </CardHeader>

                    <CardFooter>
                        <Button
                            variant="outline"
                            className="ml-auto w-24 rounded-none border-brown bg-light-background"
                        />
                    </CardFooter>
                </Card>
            ))}
        </section>
    );
}
