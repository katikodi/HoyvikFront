import Booking from "../components/Booking";
import heroImageUrl from "../images/heroImage.jpg";
import calendarIconUrl from "../icons/calendarIcon.svg";
import "../styles/Home.css";

// TODO: move all this styling into css files
// TODO: change colors to use the css variables

export default function Home() {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Hero />
        </div>
    );
}

const Hero = () => {
    return (
        <div
            style={{
                backgroundImage: `linear-gradient(93deg, rgba(62, 85, 70, 0.47) 1.68%, rgba(96, 141, 111, 0.08) 52.57%, rgba(125, 188, 146, 0.00) 97.9%), linear-gradient(106deg, rgba(0, 0, 0, 0.26) 13.4%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(180deg, #1A1A1B 0%, rgba(75, 75, 78, 0.15) 49.73%, rgba(124, 124, 129, 0.00) 100%), url(${heroImageUrl}`,
                backgroundBlendMode: "normal, darken, normal",
                height: "50rem",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% auto",
                backgroundPosition: "center"
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
    return (
        <div style={{ paddingInline: "18rem" }}>
            <div
                style={{
                    background: "var(--Background-2, #B8CBBE)",
                    boxShadow: "0 7px 4px 0 rgba(0, 0, 0, 0.25)",
                    display: "flex",
                    flexDirection: "row",
                    paddingInline: "1.8rem",
                    paddingBlock: "3.2rem ",
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
                />
                <HeroBookingInput
                    inputType={"date"}
                    labelText={"Innsjekk"}
                    icon={calendarIconUrl}
                    inputId={crypto.randomUUID()}
                />
                <HeroBookingInput
                    inputType={"date"}
                    labelText={"Innsjekk"}
                    icon={calendarIconUrl}
                    inputId={crypto.randomUUID()}
                />
                <HeroBookingInput
                    inputType={"date"}
                    labelText={"Innsjekk"}
                    icon={calendarIconUrl}
                    inputId={crypto.randomUUID()}
                />
                <Button
                    text={"SJEKK TILGJENGELIGHET"}
                    onClick={() => console.log("cluck")}
                ></Button>
            </div>
        </div>
    );
};

const HeroBookingInput = ({ inputType, labelText, icon, inputId }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", flexGrow: "1" }}>
            <label
                htmlFor={inputId}
                style={{
                    color: "var(--Text-text1, #271C22)",
                    fontFamily: "Montserrat",
                    fontSize: "1.25rem",
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
                    height: "2.5125rem",
                    alignItems: "center",
                    fontSize: "2.25rem"
                }}
            ></input>
        </div>
    );
};

const Button = ({ text, onClick }) => {
    return (
        <button
            style={{
                display: "flex",
                height: "2.5125rem",
                padding: "0 1.0625rem",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "flex-end"
            }}
            onClick={onClick}
        >
            {text}
        </button>
    );
};
