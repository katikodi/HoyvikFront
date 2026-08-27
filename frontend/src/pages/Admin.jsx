// HOOKS
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
// COMPONENTS
import { EditIcon } from "@/components/Icon";
import IconSection from "@/components/IconSection";
// STYLES
import "@/styles/Form.css";
import "@/styles/AdminPage.css";
// ASSETS
import heroImgUrl from "@/images/heroImage.webp";
import chevronDownUrl from "@/icons/chevronDown.svg";
import Button from "@/components/Button";
// DADA IMPORTS
import { icons as iconData } from "@/test-data/icons.json";

const Admin = () => {
    const [_users, setUsers] = useState(null);

    useEffect(() => {
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

        fetchUsers();
    }, []);

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
    const onSubmit = () => {};

    const { register, handleSubmit } = useForm();

    const uploadImage = async event => {
        event.preventDefault();

        console.log(event);

        const file = new FormData(event.target);

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

const EditIcons = () => {
    const [icons, setIcons] = useState({ ...iconData });
    const [currentEditing, setCurrentEditing] = useState(undefined);

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

            <div
                style={{
                    background: "#FEFEFE",
                    height: "50vh",
                    width: "100%",
                    border: "1px solid #696969"
                }}
            ></div>
        </div>
    );
};
