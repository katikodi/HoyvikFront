const Button = ({ text, onClick, height, color, filled = true, style = {}, className }) => {
    return (
        <button
            style={{
                height: height,
                backgroundColor: filled ? `${color}` : "transparent",
                border: filled ? "0" : `3px solid ${color}`,
                ...style
            }}
            onClick={onClick}
            className={className}
        >
            {text}
        </button>
    );
};

export default Button;
