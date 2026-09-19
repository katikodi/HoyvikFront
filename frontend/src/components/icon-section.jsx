const IconSection = ({ icons }) => {
    return (
        <section className="h-fit w-full min-w-0 bg-background px-4 py-24 sm:px-8 lg:px-12">
            <div className="flex w-full min-w-0 items-start justify-around gap-4">
                {icons.map(({ url, text }) => (
                    <div
                        className="flex min-w-0 flex-1 flex-col items-center"
                        key={url}
                    >
                        <img
                            src={url}
                            alt=""
                            className="max-w-full"
                        />

                        <p className="text-center font-semibold">{text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

const Icon = () => {};
export { IconSection, Icon };
