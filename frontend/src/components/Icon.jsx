import "@/styles/Icon.css";
import { useRef } from "react";

const Icon = ({ src, text }) => {
    return (
        <div className="icon">
            <img
                src={src}
                alt={`icon av ${text}`}
            />
            <IconTextContainer>
                <p
                    className="thicc-monsterrat"
                    lang="no"
                >
                    {text}
                </p>
            </IconTextContainer>
        </div>
    );
};

const IconTextContainer = ({ children, ...props }) => {
    return (
        <div
            className="icon-text-container"
            {...props}
        >
            {children}
        </div>
    );
};

const EditIcon = ({ src, text, setSrc, setText, isEditing, enableEditting, onLeave }) => {
    const inputRef = useRef();

    inputRef?.current?.focus();
    const handleEntter = () => {
        enableEditting();
    };

    return (
        <div
            className="icon edit-icon"
            onMouseEnter={handleEntter}
            onMouseLeave={onLeave}
        >
            <label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                        setSrc(URL.createObjectURL(e.target.files[0]));
                    }}
                />
                <img
                    src={src}
                    alt={`icon av ${text}`}
                />
            </label>

            <IconTextContainer>
                {isEditing ? (
                    <input
                        ref={inputRef}
                        autoFocus={true}
                        type="text"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        className="thicc-monsterrat icon-input"
                    />
                ) : (
                    <p
                        className="thicc-monsterrat"
                        lang="no"
                    >
                        {text}
                    </p>
                )}
            </IconTextContainer>
        </div>
    );
};

export default Icon;

export { EditIcon };
