"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { nanoID } from "@/servies/nanaid";

import { useRouter } from "next/navigation";

import z, { ZodError } from "zod";
import axiosInstance from "@/servies/axios";
import { useUserStore } from "@/store/user";

const loginSchema = z.object({
  username: z.string().min(9).max(9),
  password: z.string().min(6).max(10),
});

type loginDataType = {
  username: string;
  password: string;
};

export default function Login() {
  const { setUserData, setAuth } = useUserStore();

  const router = useRouter();

  const [loginData, setLoginData] = useState<loginDataType>({
    username: "",
    password: "",
  });

  const [zError, setZError] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const { username, password } = loginSchema.parse(loginData);

      setZError({});

      const { data } = await axiosInstance.post("/auth/login", { username, password }, { withCredentials: true });

      if (data.success) {
        const { username, password, confessions, likes, dislikes, comments } = data;
        setUserData({ username, password, confessions, likes, dislikes, comments });
        setAuth(true);
      }

      router.push("/profile");
    } catch (error: any) {
      if (error instanceof ZodError) {
        error.issues.map((item) => {
          setZError((prev: any) => ({ ...prev, [item.path[0]]: item.message }));
        });
        return;
      } else {
        setZError({});
      }

      setAuth(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 p-4">
      <motion.div
        className="card w-full max-w-md bg-base-100 shadow-xl border"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="card-body space-y-4">
          <motion.h2
            className="card-title text-2xl font-bold text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            Login
          </motion.h2>

          {/* Username */}
          <div className="form-control">
            <label className="label">
              <span className="label-text capitalize">username</span>
            </label>
            <input
              type="text"
              name="username"
              placeholder="Your username"
              value={loginData.username}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className={`label-text capitalize ${zError.password ? "text-xs" : null} `}>
                {zError.password ? zError.password : "password"}
              </span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={loginData.password}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Register Button */}
          <div className="form-control mt-4">
            <motion.button
              type="submit"
              onClick={handleSubmit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary w-full rounded-full"
            >
              Login
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
