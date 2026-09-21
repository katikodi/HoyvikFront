import { BoatIcon } from "./ui/icons/boatIcon";
import { CabinIcon2 } from "./ui/icons/cabin-icon2";
import { ManHiking } from "./ui/icons/manHiking";
import { VikingHelmet } from "./ui/icons/vikingHelmet";

const icons = [
    {
        icon: <BoatIcon className="size-12 md:size-24" />,
        text: "Båtutleie"
    },
    {
        icon: <CabinIcon2 className="size-12 md:size-24" />,
        text: "Hytter\u00AD &\u00AD Leiligheter"
    },
    {
        icon: <ManHiking className="size-12 md:size-24" />,
        text: "Turstier"
    },
    {
        icon: <VikingHelmet className="size-12 md:size-24" />,
        text: "Viking\u00ADaktiviteter"
    }
];

const IconSection = () => {
    const seafoamGreen = "#B8CBBE";
    return (
        <section className="h-fit w-full min-w-0 bg-background px-12 py-6 md:py-24 lg:px-12">
            <div className="grid grid-cols-2 grid-rows-2 md:flex w-full min-w-0 items-start justify-around md:gap-4">
                {icons.map(({ icon, text }) => (
                    <IconContainer key={text}>
                        {icon}
                        <p
                            className={`text-center text-sm md:text-lg font-semibold text-pretty w-full hyphens-auto text-[${seafoamGreen}] hyphens-manual`}
                        >
                            {text}
                        </p>
                    </IconContainer>
                ))}
            </div>
        </section>
    );
};

const IconContainer = ({ children, key }) => {
    return (
        <div
            className="flex flex-1 flex-col items-center px-8 overflow-x-clip"
            key={key}
        >
            {children}
        </div>
    );
};

const Icon = () => {};
export { IconSection, Icon };
