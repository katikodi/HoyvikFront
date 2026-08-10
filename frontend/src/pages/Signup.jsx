import { useForm } from "react-hook-form";
import "@/style.css";
import "@/styles/Form.css";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
const SignUp = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const { register: registerUser } = useAuth();
    const onSubmit = async data => {
        const success = await registerUser(data.email, data.password, data["confirm-password"]);
        if (success) {
            navigate("/");
        }
    };
    return (
        <div className="signup-background">
            <div className="form-container">
                <h1
                    className="cinzel"
                    style={{ color: "var(--textbrown)" }}
                >
                    Register your account
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="email"
                        placeholder="johndoe@email.com"
                        {...register("email", { required: true })}
                    />
                    {errors.email && <span className="error">Email is required!</span>}
                    <input
                        type="password"
                        placeholder="password"
                        {...register("password", { required: true })}
                    />
                    <input
                        type="password"
                        placeholder="confirm password"
                        {...register("confirm-password", {
                            required: true,
                            validate: (value, fieldValues) => {
                                return value === fieldValues.password ? true : "passwords must match";
                            }
                        })}
                    />
                    {errors["confirm-password"] && <span className="error">{errors["confirm-password"].message}</span>}
                    <input
                        type="submit"
                        value="SIGN UP"
                    />
                </form>
                <Link
                    style={{
                        color: "var(--darkgreen)"
                    }}
                    to={"/signin"}
                >
                    Already have an account?
                </Link>
            </div>
        </div>
    );
};

export default SignUp;
