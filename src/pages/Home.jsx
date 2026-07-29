import Booking from "../components/Booking";
import heroImageUrl from "../heroImage.jpg";

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
        backgroundPosition: "center",
      }}
    >
      <Nav />
      <HeroTextContent
        largeText={"Høyvika Ferie og Fritid"}
        CTAText={"CTA Tagline tekst, må vere fangande keywords som er SEO"}
      />
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
        lineHeight: "normal",
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
        lineHeight: "150%," /* 1.875rem */,
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
        justifyContent: "space-between",
      }}
    >
      <NavLogo />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "118px",
          justifyItems: "center",
          alignItems: "center",
        }}
      >
        <NavLink text="Rom" linkDestination="/Booking" />
        <NavLink text="Rom" linkDestination="/Booking" />
        <NavLink text="Rom" linkDestination="/Booking" />
        <NavLink text="Rom" linkDestination="/Booking" />
        <NavLink text="Rom" linkDestination="/Booking" />
      </div>
      <NavLogo />
    </nav>
  );
};

const NavLink = ({ text, linkDestination }) => {
  return <a href={linkDestination}>{text}</a>;
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
        flexShrink: "0",
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
        backgroundBlendMode: "normal, darken, normal",
      }}
    ></div>
  );
};

const HeroBooking = () => {
    
}
