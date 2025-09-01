"use client";

import { motion, AnimatePresence } from "framer-motion";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { User, useUserStore } from "@/store/user";
import axiosInstance from "@/servies/axios";
import ProfileFallback from "@/myComponents/Fallback/Profile";

import { daisyThemes } from "@/servies/themes";
import { useThemeStore } from "@/store/theme";
import { AxiosResponse } from "axios";

type content = {
  _id: string;
  title?: string;
  message?: string;
  confessionID?: string;
};

export type ProfileData = {
  username: string;
  password?: string | null;
  confessions: content[];
  comments: content[];
  likes: content[];
  dislikes: content[];
  _id: string;
  createdAt: string;
  [key: string]: any;
};
const ProfilePage = () => {
  const { isAuth } = useUserStore();

  const tabHeadings: Record<string, string> = {
    confessions: "Confessions you wrote",
    comments: "Your comments, click to see confession",
    likes: "Your liked confessions",
    dislikes: "Your disliked confessions",
  };

  // dummy user
  const user: ProfileData = {
    username: "",
    confessions: [],
    comments: [],
    likes: [],
    dislikes: [],
    _id: "",
    createdAt: "",
  };
  const [data, setData] = useState<ProfileData>(user);

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("confessions");

  useEffect(() => {
    const getProfileData = async () => {
      if (typeof window === "undefined") return;
      try {
        setLoading(true);

        const res: AxiosResponse = await axiosInstance.get("/user", {
          withCredentials: true,
        });

        if (!res.data.user) {
          setData(res.data.user);
        }
      } catch (error: any) {
        console.error(error.message || error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    getProfileData();
  }, [router]);

  if (loading) {
    return <ProfileFallback />;
  }

  return (
    data && (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Themes */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col justify-center items-center md:flex-row md:items-center md:justify-between gap-2 mb-4 p-4 bg-base-200 rounded-xl shadow"
        >
          <p className="text-xs md:text-sm text-muted md:text-right">Choose a theme. We will remember it for youx.</p>
          <ThemeDropdown />
        </motion.div>

        {/* Profile Header */}
        <div>
          <h1 className="text-3xl font-bold">@{data.username}</h1>
          <p className="text-sm opacity-70">Member since: Jan 2025</p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["confessions", "comments", "likes", "dislikes"].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className={`stat bg-base-200 rounded-xl shadow cursor-pointer 
          ${activeTab === tab ? "ring-2 ring-primary" : ""}`}
            >
              <div className="stat-title capitalize">{tab}</div>
              <div className="stat-value">{data[tab].length}</div>
            </motion.button>
          ))}
        </div>

        {/* Recent Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{tabHeadings[activeTab] ?? "Confessions you wrote"}</h2>

          <AnimatePresence mode="wait">
            {data[activeTab].length > 0 ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-2"
              >
                {data[activeTab].map((c: content, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.97 }}
                    transition={{ delay: i * 0.07, type: "spring", stiffness: 300 }}
                    className="card bg-base-200 shadow"
                  >
                    <div
                      onClick={() => {
                        if (activeTab == "comments") {
                          router.push(`/confession/${c.confessionID}`);
                        } else {
                          router.push(`/confession/${c._id}`);
                        }
                      }}
                      className="card-body p-4 text-sm"
                    >
                      {activeTab === "comments" ? c.message : c.title}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.p
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="opacity-70"
              >
                No confessions yet.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  );
};

export default ProfilePage;

function ThemeDropdown() {
  const [open, setOpen] = useState(false);

  const { theme, setTheme } = useThemeStore();

  return (
    <div className="relative inline-block w-48">
      {/* Trigger button */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="stat bg-base-200 border rounded-xl shadow cursor-pointer w-full px-4 py-1 text-left"
      >
        <span className="capitalize">
          {(typeof window !== "undefined" ? localStorage.getItem("theme") : null) || theme} Theme
        </span>
      </motion.button>

      {/* Dropdown options */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-1 w-full z-50 overflow-hidden rounded-xl shadow-md"
          >
            {daisyThemes.map((opt) => (
              <motion.div
                key={opt}
                onClick={() => {
                  localStorage.setItem("theme", opt);
                  setTheme(opt);
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="cursor-pointer capitalize p-2"
              >
                {/* Inner box with its own theme */}
                <div data-theme={opt} className="bg-base-100 p-2 rounded shadow-sm text-sm">
                  {opt}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
