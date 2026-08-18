import "@/styles/IconSection.css";
import Icon from "@/components/Icon";

const IconSection = ({ children, blocker = true }) => {
    return (
        <div className="icon-section">
            {blocker && <div className="blocker"></div>}
            <div className="icon-container">{children}</div>
        </div>
    );
};

export default IconSection;
