import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function HomeImageCarousel() {
    const cards = [
        { title: "Rom 1", description: "Ett rom", image: "/images/rom1.webp" },
        { title: "Rom 2", description: "Enda ett rom", image: "/images/rom2.webp" },
        { title: "Rom 3", description: "Rom", image: "/images/rom3.webp" }
    ];

    return (
        <div className="w-full bg-secondary px-0 md:px-4 py-4">
            <div className="w-full flex justify-center items-center overflow-x-clip">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true
                    }}
                    className="w-8/12"
                >
                    <CarouselContent>
                        {cards.map((card, i) => (
                            <CarouselItem
                                className="basis-9/12 overflow-clip md:basis-7/12 p-1"
                                key={i}
                            >
                                <Card className="rounded-none bg-light-background pt-0 h-auto text-ellipsis">
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
                                        <CardDescription className="text-brown col-span-2">{card.description}</CardDescription>
                                    </CardHeader>

                                    <CardFooter>
                                        <Button
                                            variant="outline"
                                            className="ml-auto w-24 rounded-none border-brown bg-light-background"
                                        />
                                    </CardFooter>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselNext />
                    <CarouselPrevious />
                </Carousel>
            </div>
        </div>
    );
}
