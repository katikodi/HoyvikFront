import axios from "axios";
import { ApiException } from "./ApiException";

export const api = axios.create({
    baseURL: "/api",
    withCredentials: true
});

api.interceptors.response.use(
    response => response,
    error => {
        if (!axios.isAxiosError(error) || !error.response) {
            // network failure, CORS, timeout — no response at all
            throw new ApiException(0, "Network:Unreachable", "Could not reach the server.");
        }

        const { status, data } = error.response;

        // if (isValidationProblem(data)) {
        //   const firstMessage =
        //     Object.values(data.errors)[0]?.[0] ?? "Validation failed.";
        //   throw new ApiException(status, "Validation", firstMessage, data.errors);
        // }

        // single-error ProblemDetails
        throw new ApiException(status, data?.title ?? "Unknown", data?.detail ?? "Something went wrong.");
    }
);
