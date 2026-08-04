import Booking from "../components/Booking";
import "../styles/Home.css";

// TODO: is there a better way of importing these urls?
import heroImageUrl from "../images/heroImage.jpg";
import calendarIconUrl from "../icons/calendarIcon.svg";
import turstierIconUrl from "@/icons/manHiking.svg";
import cabinUrl from "@/icons/cabinWithSmokingChimney.svg";
import vikingUrl from "@/icons/vikingHelmet.svg";
import boatUrl from "@/icons/boatOnTrailer.svg";
import vikingStuffUrl from "@/images/randomVikingStuff.jpg";
import rom1Url from "@/images/rom1.jpg";
import rom2Url from "@/images/rom2.jpg";
import rom3Url from "@/images/rom3.jpg";

// TODO: change divs to semantic elements
// TODO: verify accessability
// TODO: many of these components have pretty bad names tbh, i'm to lazy fix, if anyone cares feel free

export default function Home() {
    // TODO: there's probably a better place to have this data
    // might not matter if we're moving this to the db
    const icons = [
        {
            id: crypto.randomUUID(),
            iconURL: cabinUrl,
            text: "Hytter & Leiligheter"
        },
        {
            id: crypto.randomUUID(),
            iconURL: vikingUrl,
            text: "Vikingaktiviteter"
        },
        {
            id: crypto.randomUUID(),
            iconURL: boatUrl,
            text: "Båtutleie"
        },
        {
            id: crypto.randomUUID(),
            iconURL: turstierIconUrl,
            text: "Turstier"
        }
    ];
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Hero />
            <IconSection icons={icons} />
            <NextSection />
        </div>
    );
}

const Hero = () => {
    return (
        <div
            style={{
                backgroundImage: `linear-gradient(93deg, rgba(62, 85, 70, 0.47) 1.68%, rgba(96, 141, 111, 0.08) 52.57%, rgba(125, 188, 146, 0.00) 97.9%), linear-gradient(106deg, rgba(0, 0, 0, 0.26) 13.4%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(180deg, #1A1A1B 0%, rgba(75, 75, 78, 0.15) 49.73%, rgba(124, 124, 129, 0.00) 100%), url(${heroImageUrl}`
            }}
            className="hero"
        >
            <Nav />
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
        <div
            className="hero-text-container"
            style={{ color: "var(--brightgreen)" }}
        >
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
const Nav = () => {
    return (
        <nav className="nav">
            <NavLogo />
            <div className="nav-links-container">
                <NavLink
                    text="Rom"
                    linkDestination="/Booking"
                />
                <NavLink
                    text="Rom"
                    linkDestination="/Booking"
                />
                <NavLink
                    text="Rom"
                    linkDestination="/Booking"
                />
                <NavLink
                    text="Rom"
                    linkDestination="/Booking"
                />
                <NavLink
                    text="Rom"
                    linkDestination="/Booking"
                />
            </div>
            <NavLogo />
        </nav>
    );
};

const NavLink = ({ text, linkDestination }) => {
    // TODO: figure out if these have a hover effect
    // TODO: should these use react router Link instead of a?
    return (
        <a
            href={linkDestination}
            className="cinzel nav-link"
            style={{
                color: "var(--bg-2)"
            }}
        >
            {text}
        </a>
    );
};

const NavLogo = () => {
    return <div className="nav-logo">LOGO</div>;
};

const HeroBooking = () => {
    // TODO: this solution feels inelegant
    // i suspect grid would be cleaner
    const buttonHeight = "4rem";
    return (
        <div className="hero-booking-container">
            <div
                className="hero-booking"
                style={{
                    background: "var(--bg2)"
                }}
            >
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
                    className="booking-button"
                    style={{ backgroundColor: "var(--brown)", height: `${buttonHeight}` }}
                    text={"SJEKK TILGJENGELIGHET"}
                    onClick={() => console.log("cluck")}
                ></Button>
            </div>
        </div>
    );
};

const HeroBookingInput = ({ inputType, labelText, icon, inputId, height }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", flexGrow: "1", gap: "0.3rem" }}>
            <label
                htmlFor={inputId}
                className="monsterrat hero-booking-label"
                style={{
                    color: "var(--textbrown)"
                }}
            >
                {labelText}
            </label>
            <input
                className="hero-booking-input"
                id={inputId}
                type={inputType}
                style={{
                    border: "2px solid var(--darkgreen)",
                    height: height
                }}
            ></input>
        </div>
    );
};

const Button = ({ text, onClick, height, color, filled = true, style = {}, className }) => {
    return (
        <button
            style={{
                height: height,
                backgroundColor: filled ? `${color}` : "transparent",
                border: filled ? "0" : `3px solid ${color}`,
                ...style
            }}
            onClick={onClick}
            className={className}
        >
            {text}
        </button>
    );
};

const IconSection = ({ icons }) => {
    return (
        <div
            className="icon-section"
            style={{
                background: "var(--bg1)",
                color: "var(--icons)"
            }}
        >
            {icons.map(icon => (
                <IconSectionIcon
                    key={icon.id}
                    icon={icon.iconURL}
                    text={icon.text}
                />
            ))}
        </div>
    );
};

const IconSectionIcon = ({ icon, text }) => {
    return (
        <div className="icon-section-icon">
            <img
                src={icon}
                alt={`icon av ${text}`}
            />
            <p className="thicc-monsterrat">{text}</p>
        </div>
    );
};
// TODO: wtf is this section called?
const NextSection = () => {
    return (
        <div
            style={{
                background: "var(--bg2)"
            }}
        >
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
            <p
                className="monsterrat"
                style={{
                    color: "var(--Text-text-opacity-down)"
                }}
            >
                {copy}
            </p>
            <Button
                style={{
                    color: "var(--brown)"
                }}
                text={buttonText || "CTA"}
                onClick={onClick}
                height="2rem"
                filled={false}
                color="#44383E"
            />
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
        <div
            className="carousel-card"
            style={{
                border: "2px solid var(--darkgreen)"
            }}
        >
            <div
                className="carousel-card-image thicc-monsterrat"
                style={{
                    backgroundImage: `url(${imageUrl})`
                }}
            >
                {imageText}
            </div>
            <div
                className="carousel-card-header"
                style={{
                    background: "var(--bg1)"
                }}
            >
                <Button
                    filled={false}
                    style={{ border: "2px solid var(--textbrown)" }}
                    height={"2rem"}
                    onClick={() => {
                        console.log("room click");
                    }}
                />
            </div>
        </div>
    );
};
