import "@/styles/NewButton.css";

const NewButton = ({ onClick, height = "2rem", color = "gray", variant = "filled", className = "", children, ...props }) => {
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

export default NewButton;
