import "@/styles/Home.css";
// COMPONENT IMPORTS
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import IconSection from "@/components/IconSection";
// ICON AND IMAGE IMPORTS
import vikingStuffUrl from "@/images/randomVikingStuff.webp";
import roomImageUrl from "@/images/rom1.webp";
// DATA IMPORTS
import { icons } from "@/test-data/icons.json";

export default function Home() {
    return (
        <div className="flex-col bg-primary">
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
        <section className="hero">
            <div className="blocker"></div>

            <HeroContent
                title="Høyvika Ferie og Fritid"
                cta="CTA Tagline tekst, må vere fangande keywords som er SEO"
            />

            <BookingForm />
        </section>
    );
};

const HeroContent = ({ title, cta }) => {
    return (
        <header className="hero-text-container">
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
    return <h1 className="hero-large-text cinzel">{text}</h1>;
};

const HeroCTA = ({ text }) => {
    return <h2 className="monsterrat hero-cta-text">{text}</h2>;
};

const BookingForm = () => {
    const bookingFields = [
        { label: "Innsjekk", type: "date" },
        { label: "Utsjekk", type: "date" },
        { label: "Gjester", type: "number" }
    ];

    return (
        <form className="hero-booking-container">
            <div className="hero-booking">
                {bookingFields.map(field => (
                    <BookingField
                        key={field.label}
                        type={field.type}
                        label={field.label}
                    />
                ))}
                <Button
                    className="booking-button"
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
        <div className="hero-booking-input-container">
            <label
                htmlFor={fieldId}
                className="monsterrat hero-booking-label"
            >
                {label}
            </label>

            <input
                className={fieldClassNames}
                id={fieldId}
                type={type}
            />
        </div>
    );
};

const AboutSection = () => {
    return (
        <section className="about-section">
            <div className="blocker"></div>
            <AboutContent />
        </section>
    );
};

const AboutContent = () => {
    const description = "Placeholder tekst. Kan vere about section f.eks som forklare meir om ka service som blir solgt";

    return (
        <article className="random-section">
            <div className="random-section-section">
                <AboutText
                    text={description}
                    onClick={() => {
                        console.log("cta cluck");
                    }}
                    actionLabel="CTA 2"
                />

                <figure className="random-section-section-img-container">
                    <img
                        src={vikingStuffUrl}
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
        <div className="copy-section">
            <p className="monsterrat">{text}</p>

            <Button
                onClick={onClick}
                height="2rem"
                variant="outline"
                color="#44383E"
            >
                {actionLabel || "CTA"}
            </Button>
        </div>
    );
};

const ImageCarousel = () => {
    return (
        <section className="image-carousel">
            <CarouselCard
                image={roomImageUrl}
                title="ROM"
            />

            <CarouselCard
                image={roomImageUrl}
                title="ROM"
            />

            <CarouselCard
                image={roomImageUrl}
                title="ROM"
            />
        </section>
    );
};

const CarouselCard = ({ image, title }) => {
    return (
        <article className="carousel-card">
            <figure
                className="carousel-card-image thicc-monsterrat"
                style={{
                    backgroundImage: `url(${image})`
                }}
            >
                {title}
            </figure>

            <div className="carousel-card-header">
                <Button
                    variant="filled"
                    height="2rem"
                    onClick={() => {
                        console.log("room click");
                    }}
                />
            </div>
        </article>
    );
};
