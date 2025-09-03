"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { shrikhand } from "./Navbar";

type links = {
  display: string;
  route: string;
};
type pageLinksType = links[];

const Footer = () => {
  const pagesLinks: pageLinksType = [
    {
      display: "About Us",
      route: "about",
    },
    {
      display: "Anonymous Chat",
      route: "chat",
    },
  ];
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-screen bg-base-200 text-base-content p-6 md:p-10 mt-5"
    >
      <div className="flex flex-col md:flex-row justify-center md:justify-around items-center gap-6 md:gap-8">
        {/* Brand Section */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center text-center"
        >
          <h1 className={`${shrikhand.className} text-nowrap cursor-pointer text-2xl md:text-4xl`}>AP Confess</h1>
          <p className="text-sm opacity-70 mt-1">Anonymous & Honest Confessions</p>
        </motion.div>

        {/* Navigation Links Section */}
        <motion.div
          className="flex flex-col justify-center items-center gap-3 text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          <span className="font-semibold text-base md:text-lg animate-bounce">Check Out 👇</span>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm md:text-base">
            {pagesLinks.map((item, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  href={`/${item.route}`}
                  className="link link-hover hover:text-primary transition-colors duration-200"
                >
                  {item.display}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
