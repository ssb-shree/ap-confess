import axios from "axios";

import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STATUS === "DEV" ? "http://localhost:8080" : process.env.NEXT_PUBLIC_BACKENDURL,
});

axios.interceptors.request.use((config) => {
  const token = Cookies.get("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
