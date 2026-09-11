import svgRawString from "@/icons/manHiking.svg?raw";

const IconSection = ({ icons }) => {
    return (
        <div className="bg-background h-fit w-dvw pt-24 pb-20">
            <div className="flex flex-row justify-around">
                {icons.map(({ url, text }) => (
                    <div
                        className="grow flex flex-col items-center"
                        key={url}
                    >
                        <img
                            src={url}
                            alt=""
                        />
                        <p className="font-semibold">{text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Icon = () => {};
export { IconSection, Icon };
