"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import Register from "@/myComponents/Auth/Register";
import Login from "@/myComponents/Auth/Login";
import axiosInstance from "@/servies/axios";

const AuthPage = () => {
  const { type } = useParams();
  const router = useRouter();

  const { isAuth } = useUserStore();

  useEffect(() => {
    if (!["register", "login"].includes(type as string)) router.push("/auth/register");
  }, [router, type]);

  useEffect(() => {
    if (isAuth) router.push("/profile");
  }, []);

  if (!isAuth) {
    return type && type == "register" ? <Register /> : <Login />;
  }
};

export default AuthPage;
