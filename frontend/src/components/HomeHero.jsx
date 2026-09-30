import { HeroBooking } from "@/components/HeroBooking";

export default function HomeHero() {
    return (
        // nightmode image
        // <section className="relative h-[93dvh] flex-col bg-[oklch(0.44_0.19_270.71)] bg-[url(/images/real-photos/aerial-photo.webp)] bg-cover bg-no-repeat bg-center bg-fixed brightness-100 bg-blend-color-burn">
        <section className="relative flex h-[93dvh] flex-col bg-[url(/images/real-photos/aerial-photo.webp)] bg-cover bg-no-repeat bg-center bg-fixed">
            <div className="absolute top-0 left-0 w-full h-full animate-in bg-black/10 fill-mode-forwards repeat-1 fade-out-15 duration-[1.5s] delay-500 ease-in z-0"></div>
            <div className="absolute top-0 left-0 w-full h-full backdrop-blur-[1px]"></div>

            <header className="pt-52 pl-4 md:pl-20 text-hero-green text-shadow-[0_4px_4px_rgb(0_0_0/0.25)] animate-out opacity-0 fill-mode-forwards fade-out-100 duration-700 delay-200 z-20">
                <h1 className="font-serif text-2xl/normal font-semibold md:text-3xl/normal not-italic brightness-150 [paint-order:stroke] [-webkit-text-stroke:5px_var(--heading-stroke-color)] uppercase tracking-wider">
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

                <h2 className="font-sans text-xl/[150%] font-semibold not-italic brightness-150 [paint-order:stroke] [-webkit-text-stroke:3px_var(--heading-stroke-color)]">
                    CTA Tagline tekst, må vere fangande keywords som er SEO
                </h2>
            </header>

            {/* <div className="mt-auto px-44 pb-24 z-50 animate-out fill-mode-forwards opacity-0 fade-out-100 duration-[1.5s] delay-[2s]"> */}
            <div className="mt-auto px-44 pb-24 z-50 animate-in fill-mode-forwards spin-in-[1080deg] zoom-in-0 fade-in duration-[3s]">
                <HeroBooking />
            </div>
        </section>
    );
}
