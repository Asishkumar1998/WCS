// lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://wcsstestserver.azurewebsites.net/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept request to attach the Bearer token dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");

      if (!config.headers.Authorization && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (config.method === "get") {
      config.params = {
        ...(config.params || {}),
        noCache: Date.now(),
      };
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
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
