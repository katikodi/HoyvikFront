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
import userIconUrl from "@/icons/userIcon.svg";
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
    const sidebarWidth = "10vw";

    return (
        <Layout
            sidebarWidth={sidebarWidth}
            style={{ flex: "1 1 auto" }}
        >
            <EditPage pageName={"Home"} />
            <SaveBar sidebarWidth={sidebarWidth} />
        </Layout>
    );
    {
        /* <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "clip" }}> */
    }
    {
        /* <div
                    style={{ flex: "1 1 10rem", overflowY: "scroll", overflowX: "clip", padding: "2rem", width: "100%" }}
                ></div> */
    }
    {
        /* </div> */
    }
};

const Layout = ({ sidebarWidth, children }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                backgroundColor: "white",
                height: "100%",
                width: "100%",
                overflow: "clip",
                backgroundColor: "#F7F7F4",
                paddingBlockStart: "3rem"
            }}
        >
            <SideBar sidebarWidth={sidebarWidth} />

            <div style={{ flex: "1 1 auto" }}>{children}</div>
            <Pages />
        </div>
    );
};
export default Admin;
const SideBar = ({ sidebarWidth }) => {
    return <div style={{ maxWidth: `${sidebarWidth}`, backgroundColor: "var(--bg1)", flex: "1 0 10rem" }}></div>;
};
const SaveBar = ({ unsavedChanges = true, sidebarWidth }) => {
    return (
        <div
            style={{
                display: unsavedChanges ? "flex" : "none",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingInline: "1rem",
                backgroundColor: "var(--bg2)",
                height: "3rem",
                position: "absolute",
                bottom: "0",
                left: `${sidebarWidth}`,
                border: "1px solid red",
                width: `${100 - parseFloat(sidebarWidth)}vw`,
                alignItems: "center",
                textAlign: "center"
            }}
        >
            <h2 style={{ color: "black", margin: "0" }}>Save Changes</h2>
            <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
                <Button>Save</Button>
                <Button>Save</Button>
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
                paddingInline: "2rem",
                maxHeight: "100%"
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row"
                }}
            >
                <h1 style={{ margin: "0" }}>{pageName}</h1>
            </div>
            <div
                style={{
                    overflowY: "scroll",
                    overflowX: "clip",
                    flex: "1 1 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                    paddingBottom: "20vh"
                }}
            >
                <EditSection />
                <EditIcons />
            </div>
        </div>
    );
};

const EditContainer = ({ title, children }) => {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <div
            style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: "#FEFEFE",
                color: "black",
                paddingInline: "2rem"
            }}
        >
            {collapsed ? (
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
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
                    style={{
                        overflow: "clip",
                        gap: "1rem"
                    }}
                >
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
                    <h2 style={{ margin: "0", padding: "0" }}>{title}</h2>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            border: "1px solid red",
                            padding: "5px",
                            width: "100%"
                            // overflowY: "scroll"
                        }}
                    >
                        {children}
                    </div>
                </div>
            )}
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
                        style={{ width: "fit-content" }}
                        height="2rem"
                    >
                        {" "}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                            <img
                                src={uploadIconUrl}
                                style={{ height: "1rem" }}
                            />
                            Upload Image
                        </div>
                    </Button>
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

const Pages = () => {
    return (
        <div
            style={{
                background: "transparent",
                flexBasis: "30vw",
                maxWidth: "30vw",
                flexGrow: "1",
                flexShrink: "0",
                paddingInline: "2rem",
                display: "flex",
                flexDirection: "column",
                paddingBlock: "1rem",
                gap: "1rem"
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    gap: "1rem"
                }}
            >
                <div
                    style={{
                        fontSize: "8px",
                        lineHeight: "8px",
                        display: "flex",
                        alignItems: "center",
                        background: "transparent",
                        border: "1px solid black",
                        color: "black",
                        paddingLeft: "5px",
                        flex: "1 1 auto"
                    }}
                >
                    <p>Last Changed: Today</p>
                </div>
                <select
                    id="select-user"
                    style={{ background: "transparent", borderRadius: "0", paddingBlock: 0, flex: "1 1 auto" }}
                >
                    <Button style={{ paddingLeft: "0px" }}>
                        <selectedcontent></selectedcontent>
                    </Button>
                    <Option
                        value="admin"
                        iconsrc={userIconUrl}
                    >
                        <span class="option-label">Admin</span>
                    </Option>
                    <Option
                        value="user"
                        iconsrc={userIconUrl}
                    >
                        <span class="option-label">User</span>
                    </Option>
                    <Option
                        value="guest"
                        iconsrc={userIconUrl}
                    >
                        <span class="option-label">Guest</span>
                    </Option>
                </select>
            </div>
            <div style={{ background: "#FEFEFE", height: "50vh", width: "100%", border: "1px solid  #696969" }}></div>
        </div>
    );
};
const Option = ({ value, iconsrc, children }) => {
    return (
        <option value={value}>
            <div style={{ display: "flex", alignItems: "center", height: "2rem", lineHeight: "1rem", gap: "1rem" }}>
                <span
                    class="icon"
                    aria-hidden="true"
                >
                    <img
                        src={iconsrc}
                        alt="user icon"
                        height="2rem"
                        width="2rem"
                    />
                </span>
                {children}
            </div>
        </option>
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
