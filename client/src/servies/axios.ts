import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_STATUS === "DEV" ? "http://localhost:8080" : process.env.NEXT_PUBLIC_BACKENDURL,
  baseURL: "http://localhost:8080",
});

export default axiosInstance;
