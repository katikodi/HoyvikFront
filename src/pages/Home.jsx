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

// TODO: move all this styling into css files
// TODO: change colors to use the css variables
// TODO: fix the fonts on this page
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
                backgroundImage: `linear-gradient(93deg, rgba(62, 85, 70, 0.47) 1.68%, rgba(96, 141, 111, 0.08) 52.57%, rgba(125, 188, 146, 0.00) 97.9%), linear-gradient(106deg, rgba(0, 0, 0, 0.26) 13.4%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(180deg, #1A1A1B 0%, rgba(75, 75, 78, 0.15) 49.73%, rgba(124, 124, 129, 0.00) 100%), url(${heroImageUrl}`,
                backgroundBlendMode: "normal, darken, normal",
                height: "100dvh",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% auto",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column"
            }}
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
        <div style={{ width: "22rem", paddingLeft: "5.5rem" }}>
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
    return (
        <h1
            style={{
                color: "var(--Button-or-accent-3, #9BB678)",
                textShadow: "0 4px 4px rgba(0, 0, 0, 0.50)",
                fontFamily: "Cinzel",
                fontSize: "3rem",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "normal"
            }}
        >
            {text}
        </h1>
    );
};
const HeroCTAText = ({ text }) => {
    return (
        <h2
            style={{
                color: "var(--Button-or-accent-3, #9BB678)",
                textShadow: "0 4px 4px rgba(0, 0, 0, 0.50)",
                fontFamily: "Montserrat",
                fontSize: "1.25rem",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "150%," /* 1.875rem */
            }}
        >
            {text}
        </h2>
    );
};
const Nav = () => {
    return (
        <nav
            style={{
                background: "transparent",
                display: "flex",
                flexDirection: "row",
                padding: "1em 2em",
                justifyContent: "space-between"
            }}
        >
            <NavLogo />
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "118px",
                    justifyItems: "center",
                    alignItems: "center"
                }}
            >
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
            style={{
                color: "var(--Background-2, #B8CBBE)",
                fontFamily: "Cinzel",
                fontSize: "1rem",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "normal",
                textDecoration: "none"
            }}
        >
            {text}
        </a>
    );
};

const NavLogo = () => {
    return (
        <div
            style={{
                display: "flex",
                width: "15.5rem",
                height: "4.9375rem",
                padding: "1.6875rem 0 1.75rem 0",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: "0"
            }}
        >
            LOGO
        </div>
    );
};

const ShadowGradient = () => {
    return (
        <div
            style={{
                background:
                    "linear-gradient(93deg, rgba(62, 85, 70, 0.47) 1.68%, rgba(96, 141, 111, 0.08) 52.57%, rgba(125, 188, 146, 0.00) 97.9%), linear-gradient(106deg, rgba(0, 0, 0, 0.26) 13.4%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(180deg, #1A1A1B 0%, rgba(75, 75, 78, 0.15) 49.73%, rgba(124, 124, 129, 0.00) 100%)",
                backgroundBlendMode: "normal, darken, normal"
            }}
        ></div>
    );
};

const HeroBooking = () => {
    // TODO: this solution feels inelegant
    // i suspect grid would be cleaner
    const buttonHeight = "4rem";
    return (
        <div
            style={{
                paddingLeft: "12rem",
                paddingRight: "6rem",
                marginTop: "auto",
                position: "relative",
                transform: "translateY(30%)"
            }}
        >
            <div
                style={{
                    background: "var(--Background-2, #B8CBBE)",
                    boxShadow: "0 7px 4px 0 rgba(0, 0, 0, 0.25)",
                    display: "flex",
                    flexDirection: "row",
                    paddingInline: "1.8rem",
                    paddingBlock: "1rem ",
                    gap: "1rem",
                    justifyContent: "space-around",
                    width: "100%",
                    maxWidth: "100%"
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
                <div
                    style={{
                        alignSelf: "flex-end"
                    }}
                >
                    <Button
                        text={"SJEKK TILGJENGELIGHET"}
                        onClick={() => console.log("cluck")}
                        height={buttonHeight}
                        color={"var(--accent-cta, #44383E)"}
                    ></Button>
                </div>
            </div>
        </div>
    );
};

const HeroBookingInput = ({ inputType, labelText, icon, inputId, height }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", flexGrow: "1", gap: "0.3rem" }}>
            <label
                htmlFor={inputId}
                style={{
                    color: "var(--Text-text1, #271C22)",
                    fontFamily: "Montserrat",
                    fontSize: "0.75rem",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "normal"
                }}
            >
                {labelText}
            </label>
            <input
                id={inputId}
                type={inputType}
                style={{
                    background: "transparent",
                    border: "2px solid var(--Struktur, #2A3430)",
                    display: "flex",
                    width: "100%",
                    height: height,
                    alignItems: "center",
                    fontSize: "2.25rem"
                }}
            ></input>
        </div>
    );
};

const Button = ({ text, onClick, height, color, filled = true, style = {} }) => {
    return (
        <button
            style={{
                display: "flex",
                height: height,
                padding: "0 1.0625rem",
                justifyContent: "center",
                alignItems: "center",
                // alignSelf: "flex-end",
                backgroundColor: filled ? `${color}` : "transparent",
                border: filled ? "0" : `3px solid ${color}`,
                ...style
            }}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

const IconSection = ({ icons }) => {
    return (
        <div
            style={{
                display: "inline-flex",
                // height: "10.8125rem",
                padding: "5.1875rem 3.8125rem 5.25rem 3.8125rem",
                justifyContent: "center",
                alignItems: "center",
                background: "var(--Background, #678A73)",
                boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
                display: "flex",
                flexDirection: "row",
                paddingInline: "3.2rem",
                gap: "14rem"
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
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
        >
            <img
                style={{ width: "5rem", height: "5rem", aspectRatio: "1/1" }}
                src={icon}
                alt={`icon av ${text}`}
            />
            <p
                style={{ alignSelf: "stretch", textWrap: "nowrap", textAlign: "center" }}
                className="thicc-monsterrat"
            >
                {text}
            </p>
        </div>
    );
};
// TODO: wtf is this section called?
const NextSection = () => {
    return (
        <div
            style={{
                background: "var(--Background-2, #B8CBBE)"
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
        <div
            style={{
                display: "flex",
                flexDirection: "column"
            }}
        >
            <div
                style={{
                    background: "transparent",
                    display: "flex",
                    flexDirection: "row"
                }}
            >
                <CopySection
                    copy={copyText}
                    onClick={() => {
                        console.log("cta cluck");
                    }}
                    buttonText={"CTA 2"}
                />
                <div style={{ flexGrow: "1", display: "flex" }}>
                    <img
                        style={{ width: "80%", height: "auto", marginLeft: "auto" }}
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
        <div
            style={{
                paddingTop: "3rem",
                display: "flex",
                flexDirection: "column",
                flexGrow: "1",
                justifyContent: "flex-start",
                gap: "2rem",
                alignItems: "flex-start",
                paddingInline: "5rem"
            }}
        >
            <p
                className="monsterrat"
                style={{
                    color: "var(--Text-text-opacity-down, rgba(39, 28, 34, 0.70))",
                    fontSize: "1.5rem",
                    fontStyle: " normal",
                    fontWeight: "400",
                    lineHeight: "normal"
                }}
            >
                {copy}
            </p>
            <Button
                style={{
                    display: "flex",
                    width: "10.875rem",
                    padding: "1rem 0 0.9375rem 0",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "var(--accent-cta, #44383E)",
                    fontFamily: "Montserrat",
                    fontSize: "1.2rem",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "normal"
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
        <div style={{ display: "flex", flexDirection: "row", gap: "1rem", justifyContent: "center", paddingBlock: "3rem" }}>
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
            style={{
                display: "flex",
                flexDirection: "column",
                border: "2px solid var(--Struktur, #2A3430)",
                boxShadow: "6px 6px 4px 0 rgba(0, 0, 0, 0.25)",
                height: "20rem",
                width: "20rem"
            }}
        >
            <div
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    flexGrow: "1",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    text: "center",
                    color: "#FFF",
                    fontFamily: "Montserrat",
                    fontSize: "1.25rem",
                    fontStyle: "normal",
                    fontWeight: "600",
                    lineHeight: "normal"
                }}
            >
                {imageText}
            </div>
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    height: "6.4375rem",
                    justifyContent: "space-around",
                    alignItems: "center",
                    background: "var(--Background, #678A73)",
                    paddingInline: "1rem"
                }}
            >
                <Button
                    filled={false}
                    style={{ border: "2px solid var(--Text-text1, #271C22)", width: "7rem", marginLeft: "auto" }}
                    height={"2rem"}
                    onClick={() => {
                        console.log("room click");
                    }}
                />
            </div>
        </div>
    );
};
