"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <div
        className="fixed"
        style={{ left: "50%", top: "150px", transform: "translateX(-50%)" }}
      >
        <motion.h1
          className="font-display text-[100px] font-bold italic"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          STRADDLER
        </motion.h1>
      </div>
    </div>
  );
}
