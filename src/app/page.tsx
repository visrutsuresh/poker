"use client";

import { motion } from "framer-motion";
import { ScrambledText } from "@/components/ScrambledText";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <div
        className="fixed"
        style={{ left: "50%", top: "150px", transform: "translateX(-50%)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <ScrambledText
            scrambleChars="X"
            radius={80}
            duration={0.6}
            speed={0.5}
            className="font-display text-[100px] font-bold italic text-white"
          >
            STRADDLER
          </ScrambledText>
        </motion.div>
      </div>
    </div>
  );
}
