"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Custom404() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      {/* Animated card */}
      <motion.div
        className="card bg-base-100 shadow-xl border w-full max-w-md text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="card-body space-y-4">
          <motion.h1
            className="text-6xl font-extrabold text-primary"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            404
          </motion.h1>

          <motion.p
            className="text-lg text-base-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Oops! The confession you’re looking for doesn’t exist.
          </motion.p>

          <motion.button
            className="btn btn-primary w-full mt-4 rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
          >
            Go Back Home
          </motion.button>
        </div>
      </motion.div>

      {/* Floating subtle icons */}
      <motion.div
        className="flex gap-4 mt-6"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <span className="text-3xl">💌</span>
        <span className="text-3xl">📝</span>
        <span className="text-3xl">🕊️</span>
      </motion.div>
    </div>
  );
}
