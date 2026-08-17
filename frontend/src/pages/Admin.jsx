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

    // @Elias: do you need this?
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
        <Layout sidebarWidth={sidebarWidth}>
            <EditPage pageName={"Home"} />
            <SaveBar sidebarWidth={sidebarWidth} />
        </Layout>
    );
    // @Elias: wb this?

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
        <div className="admin-page-layout">
            <SideBar sidebarWidth={sidebarWidth} />

            {children}
            <Pages />
        </div>
    );
};
export default Admin;
const SideBar = ({ sidebarWidth }) => {
    return (
        <div
            className="sidebar"
            style={{
                maxWidth: `${sidebarWidth}`
            }}
        ></div>
    );
};
const SaveBar = ({ unsavedChanges = true, sidebarWidth }) => {
    return (
        <div
            className="save-bar"
            style={{
                display: unsavedChanges ? "flex" : "none",
                left: `${sidebarWidth}`,
                width: `${100 - parseFloat(sidebarWidth)}vw`
            }}
        >
            <h2>Save Changes</h2>
            <div className="save-bar-button-container">
                <Button>Save</Button>
                <Button>Save</Button>
            </div>
        </div>
    );
};
const EditPage = ({ pageName, children }) => {
    return (
        <div className="edit-page">
            <h1>{pageName}</h1>
            <div className="edit-page-sections">
                <EditSection />
                <EditIcons />
            </div>
        </div>
    );
};

const EditContainer = ({ title, children }) => {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <div className="edit-container">
            {collapsed ? (
                <div className="edit-container-collapsed">
                    <h2>{title}</h2>
                    <img
                        src={chevronDownUrl}
                        alt="chevron down"
                        onClick={() => {
                            setCollapsed(prev => !prev);
                        }}
                    />
                </div>
            ) : (
                <div className="edit-container-open">
                    <div className="edit-container-open-icon-container">
                        <img
                            src={chevronDownUrl}
                            alt="chevron down"
                            onClick={() => {
                                setCollapsed(prev => !prev);
                            }}
                        />
                    </div>
                    <h2>{title}</h2>
                    <div className="edit-container-content">{children}</div>
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
            <div className="edit-section">
                <div className="edit-section-image">
                    <img
                        src={heroImgUrl}
                        alt="alt text"
                    />
                    <Button>
                        <div>
                            <img src={uploadIconUrl} />
                            Upload Image
                        </div>
                    </Button>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="edit-section-form"
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
                </form>
            </div>
        </EditContainer>
    );
};

const EditIcons = () => {
    return (
        <EditContainer title={"Icons"}>
            <div className="edit-icons">
                <div>
                    <img
                        src={vikingHelmetUrl}
                        alt="viking helmet icon"
                        className="edit-icon-image"
                    />
                </div>
                <div>
                    <img
                        src={vikingHelmetUrl}
                        alt="viking helmet icon"
                        className="edit-icon-image"
                    />
                </div>
                <div>
                    <img
                        src={vikingHelmetUrl}
                        alt="viking helmet icon"
                        className="edit-icon-image"
                    />
                </div>
                <div>
                    <img
                        src={vikingHelmetUrl}
                        alt="viking helmet icon"
                        className="edit-icon-image"
                    />
                </div>
            </div>
        </EditContainer>
    );
};

const Pages = () => {
    return (
        <div className="pages-element">
            <div className="pages-element-section-1">
                <div className="last-changed">
                    <p>Last Changed: Today</p>
                </div>
                <select
                    className="user-select"
                    id="select-user"
                >
                    <Button>
                        <selectedcontent></selectedcontent>
                    </Button>
                    <Option
                        value="admin"
                        iconsrc={userIconUrl}
                    >
                        <span className="option-label">Admin</span>
                    </Option>
                    <Option
                        value="user"
                        iconsrc={userIconUrl}
                    >
                        <span className="option-label">User</span>
                    </Option>
                    <Option
                        value="guest"
                        iconsrc={userIconUrl}
                    >
                        <span className="option-label">Guest</span>
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
            <div className="option-content">
                <span
                    className="icon"
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
// @Elias: this? btw you need to remove the inline styling if you're keeping it

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
