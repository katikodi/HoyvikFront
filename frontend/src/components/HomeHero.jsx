import { HeroBooking } from "@/components/HeroBooking";

export default function HomeHero() {
    return (
        <section className="flex h-dvh flex-col bg-[url(/images/real-photos/aerial-photo.webp)] bg-cover bg-no-repeat bg-center bg-black bg-fixed brightness-100 ">
            <header className="pt-52 pl-4 md:pl-20 text-hero-green text-shadow-[0_4px_4px_rgb(0_0_0/0.25)]">
                <h1 className="font-serif text-2xl/normal md:text-3xl/normal not-italic brightness-150 [paint-order:stroke] [-webkit-text-stroke:1px_var(--heading-stroke-color)]">
                    Høyvika Ferie og Fritid
                </h1>

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

                <h2 className="font-sans text-base/[150%] font-normal not-italic brightness-150 [paint-order:stroke] [-webkit-text-stroke:1px_var(--heading-stroke-color)]">
                    CTA Tagline tekst, må vere fangande keywords som er SEO
                </h2>
            </header>

            <div className="mt-auto translate-y-1/2 md:translate-y-12 transform px-44">
                <HeroBooking />
            </div>
        </section>
    );
}
