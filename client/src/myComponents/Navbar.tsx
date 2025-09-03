"use client";
import React from "react";
import { motion } from "framer-motion";
import { Shrikhand } from "next/font/google";
import SearchBar from "./SearchBar";
import { FaRegUserCircle } from "react-icons/fa";

import { useRouter } from "next/navigation";

export const shrikhand = Shrikhand({
  weight: ["400"],
  subsets: ["latin"],
});

const Navbar = () => {
  const router = useRouter();
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-screen sticky top-0 z-50  backdrop-filter backdrop-blur-sm bg-opacity-30 border-b px-10 py-4 flex flex-col md:flex-row justify-between items-center text-xl gap-x-10"
    >
      {/* Logo with bounce */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        whileHover={{ scale: 1.1, rotate: -2, textShadow: "0px 0px 8px rgba(255,255,255,0.7)" }}
        whileTap={{ scale: 0.95, rotate: 0 }}
        className={`${shrikhand.className} text-nowrap cursor-pointer`}
        onClick={() => router.push("/")}
      >
        confess
      </motion.div>

      {/* Search + User */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 },
          },
        }}
        className="flex justify-around items-center w-full gap-x-2"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          className="flex justify-around items-center w-full gap-x-2"
        >
          <SearchBar />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9, rotate: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex gap-x-2 justify-center items-center cursor-pointer"
          onClick={() => router.push("/profile")}
        >
          <FaRegUserCircle size={30} />
        </motion.div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;

// <nav className="w-screen sticky top-0 backdrop-filter backdrop-blur-sm bg-opacity-30 border-b px-10 py-4 flex flex-col md:flex-row justify-between items-center text-xl gap-x-10">
//   <div className={`${shrikhand.className} text-nowrap`}>AP confess</div>
//   <div className="flex justify-around items-center w-full gap-x-2">
//     <SearchBar />
//     <div className="flex gap-x-2 justify-center items-center">
//       <FaRegUserCircle size={30} />
//     </div>
//   </div>
// </nav>
