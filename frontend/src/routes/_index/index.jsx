import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { HeroBooking } from "@/components/HeroBooking";
import { IconSection } from "@/components/icon-section";
import { icons } from "@/test-data/icons.json";
import { Card, CardHeader, CardAction, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import ReactProfiler from "@/components/ReactProfiler.tsx";

export const Route = createFileRoute("/_index/")({
    component: Home
});

function Home() {
    return (
        <ReactProfiler id="Home">
            <div className="flex-col bg-primary">
                <ReactProfiler id="Hero">
                    <Hero />
                </ReactProfiler>
                {/* <div className="bg-[#678A73] h-dvh w-dvw flex justify-center items-center"> */}
                {/* <HeroBooking /> */}
                {/* </div> */}

                <ReactProfiler id="IconSection">
                    <IconSection icons={icons}>
                        {/* {icons.map(icon => (
                    <Icon
                    key={icon.id}
                    src={icon.url}
                    text={icon.text}
                    />
                    ))} */}
                    </IconSection>
                </ReactProfiler>

                <ReactProfiler id="AboutSection">
                    <AboutSection />
                </ReactProfiler>
                <ReactProfiler id="ImageCarousel">
                    <ImageCarousel />
                </ReactProfiler>
            </div>
        </ReactProfiler>
    );
}

const Hero = () => {
    // TODO: add background gradients and blend mode
    // TODO: are we keeping blocker?
    // TODO: change image url to get from server
    return (
        <section className="h-dvh bg-no-repeat bg-cover bg-[url(/images/heroImage.webp)] flex flex-col">
            {/* <div className="blocker"></div> */}

            <HeroContent
                title="Høyvika Ferie og Fritid"
                cta="CTA Tagline tekst, må vere fangande keywords som er SEO"
            />

            {/* <BookingForm /> */}
            <div className="mt-auto px-44 transform translate-y-12">
                <HeroBooking />
            </div>
        </section>
    );
};

const HeroContent = ({ title, cta }) => {
    // TODO: add color to theme
    return (
        <ReactProfiler id="HeroContent">
            <header className="pt-52 pl-20 text-[#9BB678] text-shadow-[0_4px_4px_rgb(0_0_0/0.25)]">
                <HeroTitle text={title} />

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="350"
                    height="12"
                    viewBox="0 0 350 12"
                    fill="none"
                >
                    <path
                        d="M-6.53267e-05 5.77344L5.77344 11.5469L11.5469 5.77344L5.77344 -6.53267e-05L-6.53267e-05 5.77344ZM349.571 5.77344L343.797 -6.53267e-05L338.024 5.77344L343.797 11.5469L349.571 5.77344ZM5.77344 5.77344V6.77344L343.797 6.77344V5.77344V4.77344L5.77344 4.77344V5.77344Z"
                        fill="#BCE8EF"
                    />
                </svg>

                <HeroCTA text={cta} />
            </header>
        </ReactProfiler>
    );
};

const HeroTitle = ({ text }) => {
    return <h1 className="text-3xl/normal not-italic font-normal font-serif">{text}</h1>;
};

const HeroCTA = ({ text }) => {
    return <h2 className="text-base/[150%] not-italic font-normal font-sans">{text}</h2>;
};

const AboutSection = () => {
    return (
        <section className="bg-secondary ">
            {/* <div className="blocker"></div> */}
            <AboutContent />
        </section>
    );
};

const AboutContent = () => {
    const description = "Placeholder tekst. Kan vere about section f.eks som forklare meir om ka service som blir solgt";

    return (
        <article className="flex flex-col">
            <div className="bg-transparent flex flex-row">
                <AboutText
                    text={description}
                    onClick={() => {
                        toast("test");
                    }}
                    actionLabel="CTA 2"
                />

                <figure className="grow flex flex-row">
                    <img
                        className="w-[80%] h-auto ml-auto"
                        src="images/randomVikingStuff.webp"
                        alt="image of random viking stuff"
                    />
                </figure>
            </div>
        </article>
    );
};

const AboutText = ({ text, onClick, actionLabel }) => {
    return (
        // TODO: fix color
        <div className="pt-12 flex flex-col grow justify-start items-start px-20 text-[#271c22]/70">
            <p className="font-sans text-2xl/normal">{text}</p>

            <Button
                onClick={onClick}
                variant="outline"
                className="border-brown-button bg-secondary hover:bg-brown-button hover:text-secondary w-52 rounded-none"
            >
                {actionLabel || "CTA"}
            </Button>
        </div>
    );
};

const ImageCarousel = () => {
    return (
        <section className="flex flex-row gap-4 justify-center px-12 pt-40 bg-secondary">
            <CarouselCard
                image="/images/rom1.webp"
                title="ROM"
            />

            <CarouselCard
                image="/images/rom1.webp"
                title="ROM"
            />

            <CarouselCard
                image="/images/rom1.webp"
                title="ROM"
            />
        </section>
    );
};

const CarouselCard = () => {
    return (
        <Card className="grow pt-0 rounded-none bg-light-background">
            <img
                src="/images/rom1.webp"
                alt="Event cover"
                className="relative z-20 aspect-video w-full object-cover rounded-none"
            />
            <CardHeader className="">
                <CardAction>
                    <Badge
                        variant="secondary"
                        className="rounded-none"
                    >
                        Featured
                    </Badge>
                </CardAction>
                <CardTitle>Rom</CardTitle>
                <CardDescription className="text-brown">Ett deilig rom</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button
                    variant="outline"
                    className="ml-auto w-24 rounded-none border-brown bg-light-background"
                ></Button>
            </CardFooter>
        </Card>
    );
};
