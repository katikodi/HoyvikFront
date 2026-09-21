import { createFileRoute } from "@tanstack/react-router";
import HomeAbout from "@/components/HomeAbout.jsx";
import HomeHero from "@/components/HomeHero.jsx";
import HomeImageCarousel from "@/components/HomeImageCarousel.jsx";
import ReactProfiler from "@/components/ReactProfiler";
import { IconSection } from "@/components/icon-section";
import { icons } from "@/test-data/icons.json";

export const Route = createFileRoute("/_index/")({
    component: () => (
        <ReactProfiler id="Home">
            <div className="flex-col bg-primary">
                <ReactProfiler id="HomeHero">
                    <HomeHero />
                </ReactProfiler>

                <ReactProfiler id="IconSection">
                    <IconSection />
                </ReactProfiler>

                <ReactProfiler id="HomeAbout">
                    <HomeAbout />
                </ReactProfiler>

                <ReactProfiler id="HomeImageCarousel">
                    <HomeImageCarousel />
                </ReactProfiler>
            </div>
        </ReactProfiler>
    )
});
