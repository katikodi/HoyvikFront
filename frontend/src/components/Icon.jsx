import "@/styles/Icon.css";
import { useState } from "react";

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

const IconTextContainer = ({ children }) => {
    return <div className="icon-text-container">{children}</div>;
};

const EditIcon = ({ src, text, setSrc, setText }) => {
    const [isEditing, setIsEditing] = useState(false);
    return (
        <div className="icon edit-icon">
            <img
                src={src}
                alt={`icon av ${text}`}
            />
            <IconTextContainer className="thicc-monsterrat">
                {isEditing ? (
                    <input
                        type="text"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        className="thicc-monsterrat icon-input"
                    />
                ) : (
                    <p
                        className="thicc-monsterrat"
                        lang="no"
                        onClick={() => {
                            setIsEditing(prev => !prev);
                        }}
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
