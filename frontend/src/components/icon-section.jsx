const IconSection = ({ icons }) => {
    return (
        <div className="bg-green-400 h-72 w-dvw">
            <div className="flex flex-row justify-around">
                {icons.map(({ icon, text }) => (
                    <div className="grow flex flex-col items-center">
                        <img src="icon" />
                        <p>{text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Icon = () => {};
export { IconSection, Icon };
