import { useAuth } from "@/hooks/authContext";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DatePickerDemo } from "@/components/DatePicker";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HeroBooking } from "@/components/HeroBooking";
import { IconSection } from "@/components/icon-section";
import { icons } from "@/test-data/icons.json";

export const Route = createFileRoute("/_index/")({
    component: Home
});

function HomeComponent() {
    const { user } = useAuth();

    if (user) {
        return <h1>Hello {user.fullName}</h1>;
    }

    return <></>;
}

// COMPONENT IMPORTS
// import Button from "@/components/Button";
// import Icon from "@/components/Icon";
// import IconSection from "@/components/IconSection";
// ICON AND IMAGE IMPORTS
// import vikingStuffUrl from "@/images/randomVikingStuff.webp";
// import roomImageUrl from "@/images/rom1.webp";
// DATA IMPORTS
// import { icons } from "@/test-data/icons.json";

function Home() {
    return (
        <div className="flex-col bg-primary">
            <Hero />
            {/* <div className="bg-[#678A73] h-dvh w-dvw flex justify-center items-center"> */}
            {/* <HeroBooking /> */}
            {/* </div> */}

            <IconSection icons={icons}>
                {/* {icons.map(icon => (
                    <Icon
                        key={icon.id}
                        src={icon.url}
                        text={icon.text}
                    />
                ))} */}
            </IconSection>

            {/* <AboutSection /> */}
        </div>
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
    // TODO: fix text color
    return (
        <header className="pt-52 w-72 pl-20 text-green-700 text-shadow-[0_4px_4px_rgb(0_0_0/0.25)]">
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
    );
};

const HeroTitle = ({ text }) => {
    return <h1 className="text-3xl/normal not-italic font-normal font-serif">{text}</h1>;
};

const HeroCTA = ({ text }) => {
    return <h2 className="text-base/[150%] not-italic font-normal font-sans">{text}</h2>;
};

const BookingForm = () => {
    const bookingFields = [
        { label: "Innsjekk", type: "date" },
        { label: "Utsjekk", type: "date" },
        { label: "Gjester", type: "number" }
    ];

    return (
        <form className="pl-48 pr-24 mt-auto relative transform translate-y-3/10 z-50">
            {/* TODO: fix background color */}
            <div className="shadow-[0_7px_4px_0_rgba(0,0,0,0.25)] grid grid-cols-[1fr_1fr_0.15fr_0.5fr] px-7 py-4 gap-4 justify-around w-full max-w-full bg-gray-400">
                {bookingFields.map(field => (
                    <BookingField
                        key={field.label}
                        type={field.type}
                        label={field.label}
                    />
                ))}
                {/* TODO: fix this color */}
                <Button
                    className="self-end bg-yellow-900"
                    onClick={() => {
                        const sound = new Audio("/sounds/order_sound.wav");
                        sound.play();
                    }}
                >
                    SJEKK TILGJENGELIGHET
                </Button>
            </div>
        </form>
    );
};

const BookingField = ({ type, label, classNames = [] }) => {
    const fieldId = crypto.randomUUID();
    const fieldClassNames = [...classNames, "hero-booking-input"].join(" ");

    return (
        <div className="flex flex-col grow gap-1">
            <Label
                // TODO: fix color
                htmlFor={fieldId}
                className="font-sans text-xs/normal bg-amber-900"
            >
                {label}
            </Label>

            {type === "date" && <DatePickerDemo id={fieldId} />}
            {type === "number" && <Input type="number" />}
        </div>
    );
};

const AboutSection = () => {
    return (
        <section className="bg-background ">
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
                        console.log("cta cluck");
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

            <ImageCarousel />
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
            >
                {actionLabel || "CTA"}
            </Button>
        </div>
    );
};

const ImageCarousel = () => {
    return (
        <section className="flex flex-row gap-4 justify-center py-12 pt-40">
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

const CarouselCard = ({ image, title }) => {
    return (
        <article className="flex flex-col h-80 w-80 border-2 border-solid border-[#2a3430]">
            <figure
                className={`grow bg-no-repeat bg-cover flex flex-row items-center justify-center text-white text-xl/normal font-sans font-semibold`}
            >
                <img src={image} />
                <figcaption>{title}</figcaption>
            </figure>

            <div className="flex flex-row w-full h-26 justify-around items-center px-4 bg-[#678a73]">
                <Button
                    className="w-28 ml-auto border-2 border-solid border-[#271c22]"
                    onClick={() => {
                        console.log("room click");
                    }}
                />
            </div>
        </article>
    );
};
