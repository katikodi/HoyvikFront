import { useAuth } from "@/auth/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Register() {
    const navigate = useNavigate();

    const {register} = useAuth();
    const {
        register: registerInput,
        handleSubmit,
        formState: { errors },
      } = useForm();

      const onSubmit = async (data) => {

        if(data.confirmPassword === data.password){
            const success = await register(data.email, data.password, data.confirmPassword);
            if(success){
                navigate("/");
            }
        }

      }

      return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...registerInput("email", { required: true})} />
            <input {...registerInput("password", { required: true})} />
            <input {...registerInput("confirmPassword", { required: true})} />
            <button type="submit">Register</button>
        </form>
      );

}