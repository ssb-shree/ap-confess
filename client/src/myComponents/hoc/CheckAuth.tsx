"use client";
import axiosInstance from "@/servies/axios";
import { ReactNode, useEffect, useState } from "react";
import { useUserStore } from "@/store/user";

const CheckAuth = ({ children }: { children: ReactNode }): ReactNode => {
  const { setAuth, isAuth } = useUserStore();

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosInstance.get("/auth/check", { withCredentials: true });
        setAuth(true);
      } catch (error: any) {
        console.error(error);
        setAuth(false);
      }
    };
    checkAuth();
  }, []);

  // Load saved theme once
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "coffee";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const [theme, setTheme] = useState("coffee");

  // Update theme whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return children;
};

export default CheckAuth;
