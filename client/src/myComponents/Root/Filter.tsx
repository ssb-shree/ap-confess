"use client";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";

const Filter = () => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-around gap-4 px-4 py-2 border-b md:w-[80%] mb-5">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="btn btn-xs md:btn-md btn-outline rounded-lg "
        onClick={() => {
          router.push("/confess/");
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
          router.push("/confess/");
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
          router.push("/confess/");
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
  );
};

export default Filter;
