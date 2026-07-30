import "../styles/AboutUs.css";

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
                    <img src="https://cdn.discordapp.com/attachments/1508798814847373344/1519992055034675220/image.png?ex=6a6a6b2a&is=6a6919aa&hm=ffec9725f186b34b59581e5f6e256ddeece9eaefe96c32697feedde06d148f27&" />
                </div>
            </div>
        </>
    );
}

const title = "ABOUT US";
const para = (title + " ").repeat(255);
