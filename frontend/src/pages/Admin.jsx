// -----------------------------------
// HOOKS
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
// -----------------------------------
//COMPONENTS
import Icon, { EditIcon } from "@/components/Icon";
import IconSection from "@/components/IconSection";
// import { FileUpload } from "@/components/FileUpload";

// -----------------------------------
// STYLES
import "@/styles/Form.css";
import "@/styles/AdminPage.css";

// -----------------------------------
// ASSETS
import heroImgUrl from "@/images/heroImage.webp";
import uploadIconUrl from "@/icons/uploadIcon.svg";
import chevronDownUrl from "@/icons/chevronDown.svg";
import Button from "@/components/Button";
import vikingHelmetUrl from "@/icons/vikingHelmet.svg";
import userIconUrl from "@/icons/userIcon.svg";
// -----------------------------------
// DADA IMPORTS
import { icons as iconData } from "@/test-data/icons.json";
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
            <EditPage pageName={"Home"}>
                <EditSection />
                <EditIcons />
            </EditPage>
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
            <div className="edit-page-sections">{children}</div>
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
    const onSubmit = data => {};
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const uploadImage = async event => {
        event.preventDefault();
        console.log(event);
        let file = new FormData(event.target);
        // console.log(formData);
        const response = await fetch("/api/upload/hero", {
            method: "POST",
            body: file
        });
        return await response.json();
    };

    return (
        <EditContainer title={"Edit Hero"}>
            <div className="edit-section">
                <div className="edit-section-image">
                    <img
                        src={heroImgUrl}
                        alt="alt text"
                    />
                    <form onSubmit={uploadImage}>
                        <label>
                            <input
                                type="file"
                                accept="image/*"
                                name="file"
                            />
                        </label>
                        <Button type="submit">Upload</Button>
                    </form>
                    {/* <Button onClick={async () => {}}></Button> */}
                </div>

                {/* <FileUpload /> */}
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
const EditIcons = ({}) => {
    const [icons, setIcons] = useState({ ...iconData });
    const setText = (iconId, text) => {
        setIcons(prev => {
            const newObj = { ...prev };
            newObj[iconId].text = text;
            return newObj;
        });
    };
    const setSrc = (iconId, src) => {
        setIcons(prev => {
            const newObj = { ...prev };
            newObj[iconId].url = src;
            return newObj;
        });
    };
    const [currentEditing, setCurrentEditing] = useState(undefined);
    const enableEditing = id => {
        setCurrentEditing(id);
    };
    const onLeave = id => {
        if (currentEditing === id) {
            setCurrentEditing(undefined);
        }
    };
    return (
        <EditContainer title={"Icons"}>
            <div
                className="edit-icons"
                onMouseLeave={() => {
                    setCurrentEditing(undefined);
                }}
            >
                <IconSection blocker={false}>
                    {Object.values(icons).map(icon => (
                        <EditIcon
                            key={icon.id}
                            src={icon.url}
                            text={icon.text}
                            setText={text => {
                                setText(icon.id, text);
                            }}
                            setSrc={src => {
                                setSrc(icon.id, src);
                            }}
                            isEditing={currentEditing === icon.id}
                            enableEditting={() => {
                                enableEditing(icon.id);
                            }}
                            onLeave={() => {
                                onLeave(icon.id);
                            }}
                        />
                    ))}
                </IconSection>
            </div>
        </EditContainer>
    );
};

const Pages = () => {
    return (
        <div className="pages-element">
            <div className="pages-element-section-1">
                <div className="last-changed pb-sm">
                    <p className="text-brown text-base">Last Changed: Today</p>
                </div>
                <label>
                    <select
                        name="selectedUser"
                        defaultValue="admin"
                        className="rounded-none pb-sm bg-transparent text-brown user-select"
                    >
                        <option value="admin">Admin</option>
                        <option value="usre">User</option>
                        <option value="guest">Guest</option>
                    </select>
                </label>
            </div>
            <div style={{ background: "#FEFEFE", height: "50vh", width: "100%", border: "1px solid  #696969" }}></div>
        </div>
    );
};

const Option = ({ value, iconsrc, children }) => {
    return (
        <option value={value}>
            <div className="option-content">
                <span aria-hidden="true">
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
