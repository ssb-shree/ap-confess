"use client";
import ConfessionDiv from "@/myComponents/ConfessionDiv";
import Filter from "@/myComponents/Root/Filter";

import { motion } from "framer-motion";

import { useEffect, useState } from "react";

import axiosInstance from "@/servies/axios";
import { Confession } from "@/types";

import ConfessionDivFB from "@/myComponents/Fallback/ConfessionDivFB";
import { useRouter } from "next/navigation";
import { AxiosResponse } from "axios";
import { errorToast } from "@/servies/toast";

const Rootpage = () => {
  const [confessions, setConfessions] = useState<Confession[] | null>(null);

  const [active, setActive] = useState<string>("new");
  const [skip, setSkip] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    const getConfessions = async () => {
      setConfessions([]);
      try {
        const res: AxiosResponse = await axiosInstance.get(`/confess/${active}?skip=${5 * skip}`, {
          withCredentials: true,
        });

        setConfessions(res.data.confessions);
      } catch (error: any) {
        console.error(error.message || error);
        errorToast("failed to fetch confessions");
      }
    };

    getConfessions();
  }, [active, skip]);

  return (
    <section className="w-screen h-screen flex flex-col gap-y-2 justify-start items-center mt-5 px-2">
      {/* Filter */}
      <div className="flex items-center justify-around gap-4 px-4 py-2 border-b md:w-[80%] mb-5">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="btn btn-xs md:btn-md btn-outline rounded-lg "
          onClick={() => {
            setActive("best");
          }}
        >
          ⭐ Best
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="btn btn-xs md:btn-md btn-outline rounded-lg "
          onClick={() => {
            setActive("trending");
          }}
        >
          🔥 Trending
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="btn btn-xs md:btn-md btn-outline rounded-lg "
          onClick={() => {
            setActive("new");
          }}
        >
          ⏳ Newest
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="btn btn-xs md:btn-md btn-outline btn-primary rounded-lg "
          onClick={() => {
            router.push("/confess/write");
          }}
        >
          Write Confession
        </motion.button>
      </div>

      {/* Confession Cards Array */}
      <div className="w-full flex flex-col justify-center items-center gap-y-10 px-5 md:px-0">
        {confessions ? (
          confessions.map((item: Confession, index) => {
            return <ConfessionDiv key={item._id} data={item} />;
          })
        ) : (
          <ConfessionDivFB />
        )}
      </div>

      {/* Pagination */}
      <div className="join grid grid-cols-2 mt-5">
        <button onClick={() => setSkip((prev) => Math.max(prev - 1, 0))} className="join-item btn btn-outline">
          Previous page
        </button>
        <button onClick={() => setSkip((prev) => prev + 1)} className="join-item btn btn-outline">
          Next
        </button>
      </div>
    </section>
  );
};

export default Rootpage;
