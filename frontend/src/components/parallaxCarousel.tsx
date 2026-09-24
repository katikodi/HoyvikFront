import React, { useCallback, useEffect, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { type CarouselApi } from "@/hooks/useCarousel";
import { type EmblaEventType } from "embla-carousel";
import "@/styles/parallax.css";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "./ui/badge";

// import { DotButton, useDotButton } from "./EmblaCarouselDotButton";
type cardProps = {
    title: string;
    description: string;
    image: string;
};

const TWEEN_FACTOR_BASE = 0.2;

const ParallaxCarousel = ({ slides }: { slides: cardProps[] }) => {
    const [api, setApi] = React.useState<CarouselApi>();
    const tweenFactor = useRef(0);
    const tweenNodes = useRef<(HTMLElement | null)[] | undefined>([]);
    React.useEffect(() => {
        if (!api) {
            return;
        }
    }, [api]);

    const setTweenFactor = useCallback((api: CarouselApi) => {
        if (!api?.scrollSnapList) {
            return;
        }
        tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
    }, []);

    const tweenParallax = useCallback((api: CarouselApi, eventName?: EmblaEventType) => {
        if (!api) {
            return;
        }
        const engine = api.internalEngine();
        const scrollProgress = api.scrollProgress();
        const slidesInView = api.slidesInView();
        const isScrollEvent = eventName === "scroll";

        api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
            let diffToTarget = scrollSnap - scrollProgress;
            const slidesInSnap = engine.slideRegistry[snapIndex];

            slidesInSnap.forEach(slideIndex => {
                if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

                if (engine.options.loop) {
                    engine.slideLooper.loopPoints.forEach(loopItem => {
                        const target = loopItem.target();

                        if (slideIndex === loopItem.index && target !== 0) {
                            const sign = Math.sign(target);

                            if (sign === -1) {
                                diffToTarget = scrollSnap - (1 + scrollProgress);
                            }
                            if (sign === 1) {
                                diffToTarget = scrollSnap + (1 - scrollProgress);
                            }
                        }
                    });
                }

                const translate = diffToTarget * (-1 * tweenFactor.current) * 100;
                const tweenNode = tweenNodes.current && tweenNodes.current[slideIndex];
                if (tweenNode) {
                    tweenNode.style.transform = `translateX(${translate}%)`;
                }
            });
        });
    }, []);
    useEffect(() => {
        if (!api) return;

        // setTweenNodes(api);
        setTweenFactor(api);
        tweenParallax(api);

        api
            // .on("reInit", setTweenNodes)
            .on("reInit", setTweenFactor)
            .on("reInit", tweenParallax)
            .on("scroll", tweenParallax)
            .on("slideFocus", tweenParallax);
    }, [api, tweenParallax]);
    return (
        <Carousel
            setApi={setApi}
            className="w-6/12"
            opts={{
                align: "center",
                loop: true
            }}
        >
            <CarouselContent>
                {slides.map((card, i) => (
                    <CarouselItem className="basis-10/12">
                        <Card className="rounded-none bg-light-background pt-0 h-auto text-ellipsis">
                            <div
                                className="relative h-full w-full flex justify-center"
                                ref={element => {
                                    if (tweenNodes.current) {
                                        if (element) {
                                            tweenNodes.current[i] = element;
                                        } else {
                                            // Cleans up the array if the element unmounts
                                            delete tweenNodes.current[i];
                                        }
                                    }
                                }}
                            >
                                <img
                                    className="aspect-video block h-76 w-full object-cover rounded-none max-w-none flex-none basis-[calc(130% + 1rem * 2))]"
                                    src={card.image}
                                    alt={`${card.title} cover`}
                                />
                            </div>

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
    );
};

export default ParallaxCarousel;
