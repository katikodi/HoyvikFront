const Button = ({ onClick, height = "2rem", color, filled = true, style = {}, className, children }) => {
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
            {children}
        </button>
    );
};

export default Button;
