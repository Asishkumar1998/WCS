// lib/axios.js
import { API_BASE_URL } from "@/constants/api";
import { getAuth } from "@/app/utils/auth";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept request to attach the Bearer token dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path !== "/signup" && path !=="/thankyou") {
        const auth = getAuth();
        if (!auth) {
          window.location.href = "/login";
          return Promise.reject("Session expired");
        }

        config.headers.Authorization = auth.restApiToken;
      }
      
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Token may have expired");
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("auth");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
