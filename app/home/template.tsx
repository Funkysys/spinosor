"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.section
        initial={{ opacity: 0, x: 50, y: 80 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ ease: "easeInOut", duration: 1 }}
      >
        {children}
      </motion.section>
    </AnimatePresence>
  );
}
