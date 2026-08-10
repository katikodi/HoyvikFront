import { useAuth } from "@/auth/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();

      const navigate = useNavigate();
      const {login, logout} = useAuth();

      const onSubmit = async (data) => {
        
        const result = await login(data.email, data.confirmPassword);
        if(result){
            navigate("/");
        }
        // const response = await fetch("/api/auth/login", {
        //     method: "POST",
        //     body: JSON.stringify(data),
        //     headers: {
        //         "Content-Type": "application/json",
        //     }
        // });

        // console.log(response    );
        // if(response.status == 200){
        //     navigate("/");
        // }
      }


      return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("email", { required: true} )} />
            <input {...register("password", { required: true} )} />
            <button type="submit">Login</button>
        </form>
      );

}