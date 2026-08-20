import "@/styles/AboutUs.css";

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
                        <button>BUTTON BUTTON BUTTON</button>
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
