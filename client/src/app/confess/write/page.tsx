"use client";

import { useState, useEffect } from "react";

import { motion } from "framer-motion";

import axiosInstance from "@/servies/axios";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user";
import { AxiosResponse } from "axios";

export type confessionType = {
  title: string;
  body: string;
  categories: string[];
};

const initialConfessionState: confessionType = {
  title: "",
  body: "",
  categories: [],
};

const WriteConfessionPage = () => {
  const [isDisabled, setDisabled] = useState<boolean>(false);

  const router = useRouter();
  const { isAuth } = useUserStore();

  useEffect(() => {
    if (!isAuth) {
      router.push("/");
    }
  }, [isAuth, router]);

  const [confession, setConfession] = useState<confessionType>(initialConfessionState);

  const submitConfession = async () => {
    setDisabled(true);
    try {
      const res: AxiosResponse = await axiosInstance.post("/confess/write", confession, { withCredentials: true });

      router.push(`/confession/${res.data.confession._id}`);
    } catch (error: any) {
      alert(error.message || error);
    } finally {
      setDisabled(false);
    }
  };
  return (
    <section className="flex justify-center items-center min-h-screen bg-base-200 p-4">
      {/* Animate the card in */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="card w-full max-w-2xl bg-base-100 shadow-xl border"
      >
        <div className="card-body space-y-2">
          {/* Header */}
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-title text-2xl font-bold"
          >
            Write a Confession
          </motion.h2>

          {/* Title Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Enter a catchy title..."
              className="input input-bordered w-full"
              disabled={isDisabled}
              onChange={(e) => setConfession({ ...confession, title: e.target.value })}
              value={confession.title}
            />
          </div>

          {/* Confession Textarea */}
          <div className="form-control flex flex-col">
            <label className="label">
              <span className="label-text">Your Confession</span>
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.01 }}
              className="textarea textarea-bordered h-32 w-full"
              placeholder="Write your confession here..."
              disabled={isDisabled}
              onChange={(e) => setConfession({ ...confession, body: e.target.value })}
              value={confession.body}
            ></motion.textarea>
          </div>

          {/* Categories Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Categories</span>
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="e.g. college, love, secret"
              className="input input-bordered w-full"
              disabled={isDisabled}
              onChange={(e) => setConfession({ ...confession, categories: e.target.value.split(",") })}
              onClick={() => console.log(confession.categories)}
            />
            <label className="label">
              <span className="label-text-alt">Separate categories with commas</span>
            </label>
          </div>

          {/* Post Button */}
          <div className="form-control mt-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={submitConfession}
              className="btn btn-primary w-full rounded-full"
              disabled={isDisabled}
            >
              Post Confession
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default WriteConfessionPage;
