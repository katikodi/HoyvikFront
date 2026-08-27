import { useForm } from "react-hook-form";
import "@/style.css";
import "@/styles/Form.css";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SignIn = () => {
    const { login } = useAuth();
    let navigate = useNavigate();
    const onSubmit = async data => {
        const result = await login(data.email, data.password);
        if (result) {
            navigate("/");
        }
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    return (
        <div className="signup-background">
            <div className="form-container">
                <h1
                    className="cinzel"
                    style={{ color: "var(--textbrown)" }}
                >
                    Sign in
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="email"
                        placeholder="johndoe@email.com"
                        defaultValue={"admin@admin.com"}
                        {...register("email", { required: true })}
                    />
                    {errors.email && <span className="error">Email is required!</span>}
                    <input
                        type="password"
                        placeholder="password"
                        defaultValue={"admin@admin.com"}
                        {...register("password", { required: true })}
                    />
                    <Link
                        style={{
                            color: "var(--darkgreen)"
                        }}
                        // to={"/"}
                    >
                        Forgot your password?
                    </Link>

                    <input
                        type="submit"
                        value="SIGN IN"
                    />
                </form>
                <Link
                    style={{
                        color: "var(--darkgreen)"
                    }}
                    to={"/signup"}
                >
                    Don't have an account?
                </Link>
            </div>
        </div>
    );
};

export default SignIn;
