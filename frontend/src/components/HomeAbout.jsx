import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const description = "Placeholder tekst. Kan vere about section f.eks som forklare meir om ka service som blir solgt";

export default function HomeAbout() {
    return (
        <section className="bg-secondary">
            <article className="flex flex-row">
                <div className="flex grow flex-col items-start px-20 pt-12 text-[#271c22]/70">
                    <p className="font-sans text-2xl/normal">{description}</p>

                    <Button
                        onClick={() => toast("test")}
                        variant="outline"
                        className="w-52 rounded-none border-brown-button bg-secondary hover:bg-brown-button hover:text-secondary"
                    >
                        CTA 2
                    </Button>
                </div>

                <figure className="flex grow">
                    <img
                        className="hidden md:inline ml-auto h-auto w-[80%]"
                        src="/images/randomVikingStuff.webp"
                        alt="Image of random viking stuff"
                    />
                </figure>
            </article>
        </section>
    );
}
