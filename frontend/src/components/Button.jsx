import "@/styles/Button.css";

const Button = ({ onClick, height, color = "gray", variant = "filled", className = "", children, ...props }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`button button--${variant} ${className}`}
            style={{ "--button-color": color, height }}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
