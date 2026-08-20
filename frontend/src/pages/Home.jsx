import "@/styles/Home.css";

// -------------------------------------------------------------
// COMPONENT IMPORTS
import Booking from "@/components/Booking";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import IconSection from "@/components/IconSection";

// ------------------------------------------------------------
// ICON AND IMAGE IMPORTS
// TODO: is there a better way of importing these urls?
import heroImageUrl from "@/images/heroImage.webp";
import calendarIconUrl from "@/icons/calendarIcon.svg";
import turstierIconUrl from "@/icons/manHiking.svg";
import cabinUrl from "@/icons/cabinWithSmokingChimney.svg";
import vikingUrl from "@/icons/vikingHelmet.svg";
import boatUrl from "@/icons/boatOnTrailer.svg";
import vikingStuffUrl from "@/images/randomVikingStuff.webp";
import rom1Url from "@/images/rom1.webp";
import rom2Url from "@/images/rom2.webp";
import rom3Url from "@/images/rom3.webp";
// -------------------------------------------------------------
// DADA IMPORTS

import { icons } from "@/test-data/icons.json";
// -------------------------------------------------------------
// TODO: change divs to semantic elements
// TODO: verify accessability
// TODO: many of these components have pretty bad names tbh, i'm to lazy fix, if anyone cares feel free

export default function Home() {
    // TODO: there's probably a better place to have this data
    // might not matter if we're moving this to the db
    return (
        <div style={{ display: "flex", flexDirection: "column", backgroundColor: "var(--bg1)" }}>
            <Hero />
            <IconSection>
                {icons.map(icon => (
                    <Icon
                        key={icon.id}
                        src={icon.url}
                        text={icon.text}
                    />
                ))}
            </IconSection>
            <AboutSection />
        </div>
    );
}

const Hero = () => {
    return (
        <div className="hero">
            <div className="blocker"></div>
            <HeroTextContent
                largeText={"Høyvika Ferie og Fritid"}
                CTAText={"CTA Tagline tekst, må vere fangande keywords som er SEO"}
            />
            <HeroBooking />
        </div>
    );
};

const HeroTextContent = ({ largeText, CTAText }) => {
    return (
        <div className="hero-text-container">
            <HeroLargeText text={largeText} />
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
            <HeroCTAText text={CTAText} />
        </div>
    );
};

const HeroLargeText = ({ text }) => {
    return <h1 className="hero-large-text cinzel">{text}</h1>;
};
const HeroCTAText = ({ text }) => {
    return <h2 className="monsterrat hero-cta-text">{text}</h2>;
};

const HeroBooking = () => {
    // TODO: this solution feels inelegant
    // i suspect grid would be cleaner
    const buttonHeight = "4rem";
    return (
        <div className="hero-booking-container">
            <div className="hero-booking">
                <HeroBookingInput
                    inputType={"date"}
                    labelText={"Innsjekk"}
                    icon={calendarIconUrl}
                    inputId={crypto.randomUUID()}
                    height={buttonHeight}
                />
                <HeroBookingInput
                    inputType={"date"}
                    labelText={"Innsjekk"}
                    icon={calendarIconUrl}
                    inputId={crypto.randomUUID()}
                    height={buttonHeight}
                />
                <HeroBookingInput
                    inputType={"date"}
                    labelText={"Innsjekk"}
                    icon={calendarIconUrl}
                    inputId={crypto.randomUUID()}
                    height={buttonHeight}
                />
                <HeroBookingInput
                    inputType={"date"}
                    labelText={"Innsjekk"}
                    icon={calendarIconUrl}
                    inputId={crypto.randomUUID()}
                    height={buttonHeight}
                />
                <Button
                    height={buttonHeight}
                    className="booking-button"
                    onClick={() => console.log("cluck")}
                >
                    SJEKK TILGJENGELIGHET
                </Button>
            </div>
        </div>
    );
};

const HeroBookingInput = ({ inputType, labelText, icon, inputId, height }) => {
    return (
        <div className="hero-booking-input-container">
            <label
                htmlFor={inputId}
                className="monsterrat hero-booking-label"
            >
                {labelText}
            </label>
            <input
                className="hero-booking-input"
                id={inputId}
                type={inputType}
            ></input>
        </div>
    );
};

// TODO: wtf is this section called?
const AboutSection = () => {
    return (
        <div className="about-section">
            <div className="blocker"></div>
            <RandomSection />
        </div>
    );
};

// TODO: i have no idea what to name these sections
const RandomSection = () => {
    const copyText = "Placeholder tekst. Kan vere about section f.eks som forklare meir om ka service som blir solgt";
    return (
        <div className="random-section">
            <div className="random-section-section">
                <CopySection
                    copy={copyText}
                    onClick={() => {
                        console.log("cta cluck");
                    }}
                    buttonText={"CTA 2"}
                />
                <div className="random-section-section-img-container">
                    <img
                        src={vikingStuffUrl}
                        alt="image of random viking stuff"
                    />
                </div>
            </div>
            <ImageCarousel />
        </div>
    );
};

const CopySection = ({ copy, onClick, buttonText }) => {
    return (
        <div className="copy-section">
            <p className="monsterrat">{copy}</p>
            <Button
                onClick={onClick}
                height="2rem"
                filled={false}
                color="#44383E"
            >
                {buttonText || "CTA"}
            </Button>
        </div>
    );
};

const ImageCarousel = () => {
    return (
        <div className="image-carousel">
            <CarouselCard
                imageUrl={rom1Url}
                imageText="ROM"
            />
            <CarouselCard
                imageUrl={rom1Url}
                imageText="ROM"
            />
            <CarouselCard
                imageUrl={rom1Url}
                imageText="ROM"
            />
        </div>
    );
};

const CarouselCard = ({ imageUrl, imageText }) => {
    return (
        <div className="carousel-card">
            <div
                className="carousel-card-image thicc-monsterrat"
                style={{
                    backgroundImage: `url(${imageUrl})`
                }}
            >
                {imageText}
            </div>
            <div className="carousel-card-header">
                <Button
                    filled={false}
                    height={"2rem"}
                    onClick={() => {
                        console.log("room click");
                    }}
                />
            </div>
        </div>
    );
};
