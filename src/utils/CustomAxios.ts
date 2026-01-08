// @ts-nocheck
import axios from "axios";
import config from "@/config";

const axiosInstance = axios.create({
    baseURL: config.apiBaseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        let accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
    }
);

export const NormalAxiosInstance = axios.create({
    baseURL: config.apiBaseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
