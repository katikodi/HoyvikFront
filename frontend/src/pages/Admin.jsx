// -----------------------------------
// HOOKS / COMPONENTS
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// -----------------------------------
// STYLES
import "@/styles/Form.css";
import "@/styles/AdminPage.css";

// -----------------------------------
// ASSETS
import heroImgUrl from "@/images/heroImage.jpg";
import uploadIconUrl from "@/icons/uploadIcon.svg";
import chevronDownUrl from "@/icons/chevronDown.svg";
import Button from "@/components/Button";
import vikingHelmetUrl from "@/icons/vikingHelmet.svg";
// -----------------------------------

const Admin = () => {
    const [users, setUsers] = useState(null);

    async function fetchUsers() {
        const response = await fetch("/api/admin/users", {
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            setUsers(null);
            return;
        }

        const data = await response.json();
        setUsers(data.users);
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    // if (!users) return <p>No users</p>;
    //  <ul>
    //         {users.map(user => (
    //             <User
    //                 key={user.id}
    //                 user={user}
    //             />
    //         ))}
    //     </ul>
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                backgroundColor: "white",
                height: "100vh",
                width: "100vw",
                overflow: "clip"
            }}
        >
            <SideBar />
            <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "clip" }}>
                <div style={{ flex: "1 1 10rem", overflowY: "scroll", overflowX: "clip", padding: "2rem", width: "100%" }}>
                    <EditPage pageName={"Home"} />
                </div>
                <SaveBar />
            </div>
        </div>
    );
};
export default Admin;
const SideBar = () => {
    return <div style={{ maxWidth: "10rem", backgroundColor: "var(--bg1)", flex: "1 0 10rem" }}></div>;
};
const SaveBar = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingInline: "1rem",
                backgroundColor: "var(--brightgreen)",
                height: "3rem"
            }}
        >
            <h2>Save Changes</h2>
            <div>
                <Button></Button>
                <Button></Button>
            </div>
        </div>
    );
};
const EditPage = ({ pageName, children }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                flex: "1 1 auto",
                paddingInline: "2rem",
                maxHeight: "100%",
                width: "100%"
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row"
                }}
            >
                <h1>{pageName}</h1>
            </div>
            <div style={{ overflowY: "clip", overflowX: "clip", flex: "1 1 auto" }}>
                <EditSection />
                <EditIcons />
            </div>
        </div>
    );
};

const EditContainer = ({ title, children }) => {
    const [collapsed, setCollapsed] = useState(false);

    return collapsed ? (
        <div
            style={{
                width: "100%",
                padding: "1rem",
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "#777",
                color: "white",
                paddingInline: "2rem"
            }}
        >
            <h2 style={{ margin: "0", paddingBottom: "1rem", paddingTop: "0px" }}>{title}</h2>
            <img
                src={chevronDownUrl}
                alt="chevron down"
                style={{ height: "30px", width: "30px" }}
                onClick={() => {
                    setCollapsed(prev => !prev);
                }}
            />
        </div>
    ) : (
        <div
            className="edit-section"
            style={{ padding: "1rem", width: "100%", overflow: "clip", gap: "1rem", backgroundColor: "#777", color: "white" }}
        >
            <div style={{ width: "100%" }}>
                <div style={{ marginLeft: "auto", width: "fit-content" }}>
                    <img
                        src={chevronDownUrl}
                        alt="chevron down"
                        style={{ height: "30px", width: "30px" }}
                        onClick={() => {
                            setCollapsed(prev => !prev);
                        }}
                    />
                </div>
            </div>
            <h2 style={{ margin: "0", padding: "0" }}>{title}</h2>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    border: "1px solid red",
                    padding: "5px",
                    width: "100%"
                }}
            >
                {children}
            </div>
        </div>
    );
};

const EditSection = () => {
    const onSubmit = data => {
        console.log(data);
    };
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    return (
        <EditContainer title={"Edit Hero"}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        paddingBlock: "1rem"
                    }}
                >
                    <img
                        src={heroImgUrl}
                        alt="alt text"
                        style={{ height: "100%", width: "100%", objectFit: "contain" }}
                    />
                    <Button
                        text={
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                                <img
                                    src={uploadIconUrl}
                                    style={{ height: "1rem" }}
                                />
                                Upload Image
                            </div>
                        }
                        style={{ width: "fit-content" }}
                        height="2rem"
                    ></Button>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{ flex: "1 1 auto" }}
                >
                    <input
                        type="text"
                        placeholder="Title"
                        {...register("Title", { required: false })}
                    />
                    <input
                        type="text"
                        placeholder="Undertext"
                        {...register("Undertext", { required: false })}
                    />
                    <input
                        type="text"
                        placeholder="Button text"
                        {...register("Button text", { required: false })}
                    />
                    {/* <Link
                        style={{
                            color: "var(--darkgreen)"
                        }}
                        // TODO: set up password reset
                        // to={"/"}
                    >
                        Forgot your password?
                    </Link> */}

                    {/* <input
                        type="submit"
                        value="SIGN IN"
                    /> */}
                </form>
            </div>
        </EditContainer>
    );
};
// const products = [
//   { productName: "Shirt", productId: 5, stock: 32 },
//   { productName: "Pants", productId: 6, stock: 5 },
//   { productName: "Socks", productId: 10, stock: 22 },
// ];

const EditIcons = () => {
    return (
        <EditContainer title={"Icons"}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
                <div>
                    <img
                        src={vikingHelmetUrl}
                        alt="viking helmet icon"
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                    />
                </div>
                <div>
                    <img
                        src={vikingHelmetUrl}
                        alt="viking helmet icon"
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                    />
                </div>
                <div>
                    <img
                        src={vikingHelmetUrl}
                        alt="viking helmet icon"
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                    />
                </div>
                <div>
                    <img
                        src={vikingHelmetUrl}
                        alt="viking helmet icon"
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                    />
                </div>
            </div>
        </EditContainer>
    );
};

function User({ user }) {
    const { id, userName, email } = user;
    return (
        <li style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <h3>{userName}</h3>
            <p>{email}</p>
            <small>{id}</small>
        </li>
    );
}
