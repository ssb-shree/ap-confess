"use client";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card bg-base-200 shadow-xl p-6 rounded-xl"
      >
        <h1 className="text-3xl font-bold mb-2">About Ap-Confess</h1>
        <p className="opacity-70 text-sm md:text-base">
          Ap-Confess is an anonymous confession platform built for students to freely share their thoughts, feelings,
          and experiences. Whether you want to express something heartfelt, vent out frustrations, or simply share a
          funny story — this space is yours.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card bg-base-200 shadow-xl p-6 rounded-xl"
      >
        <h2 className="text-xl font-semibold mb-2">🎯 Our Mission</h2>
        <p className="opacity-70 text-sm md:text-base">
          To create a safe, anonymous, and supportive community where everyone can speak without judgment.
        </p>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="card bg-base-200 shadow-xl p-6 rounded-xl"
      >
        <h2 className="text-xl font-semibold mb-4">✨ Features</h2>
        <ul className="list-disc list-inside space-y-2 text-sm md:text-base opacity-80">
          <li>Post confessions anonymously</li>
          <li>React with ❤️ or 💩</li>
          <li>Comment and engage with others</li>
          <li>Report inappropriate content</li>
          <li>Personalized themes to match your vibe</li>
        </ul>
      </motion.div>

      {/* Community Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="card bg-base-200 shadow-xl p-6 rounded-xl"
      >
        <h2 className="text-xl font-semibold mb-2">📜 Community Guidelines</h2>
        <p className="opacity-70 text-sm md:text-base mb-2">
          To keep Ap-Confess safe and respectful, we ask everyone to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm md:text-base opacity-80">
          <li>No hate speech, bullying, or harassment</li>
          <li>Respect others’ privacy</li>
          <li>Use the report option for harmful content</li>
        </ul>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-center opacity-70 text-xs md:text-sm"
      >
        Built with ❤️ using Next.js, Tailwind, and DaisyUI
      </motion.div>
    </div>
  );
}
