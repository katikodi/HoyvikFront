import "@/styles/AboutUs.css";
import Button from "@/components/Button";

export default function AboutUs() {
    return (
        <>
            <div
                id="mainContainer"
                className="columnContent"
            >
                <h1>{title}</h1>
                <div className="rowContent centerContent">
                    <div
                        id="contentContainer"
                        className="columnContent"
                    >
                        <p>{para}</p>
                        <Button>BUTTON BUTTON BUTTON</Button>
                    </div>
                    <img
                        src="/images/jhonny_hans_blisco.webp"
                        style={{ height: "40rem", width: "auto" }}
                    />
                </div>
            </div>
        </>
    );
}

const title = "ABOUT US";
const para = (title + " ").repeat(255);
