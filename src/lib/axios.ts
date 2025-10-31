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
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (config.method === "get") {
      const noCacheValue = Date.now();
      config.params = { ...(config.params || {}), noCache: noCacheValue };
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
    if (error.response.status === 401) {
      console.log("Unauthorized! Token may have expired");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
