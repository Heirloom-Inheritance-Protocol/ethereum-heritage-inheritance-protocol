"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ScrollIndicatorProps {
  targetId?: string;
}

export function ScrollIndicator({ targetId = "content" }: ScrollIndicatorProps) {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if user is near the bottom (within 100px)
      const atBottom = scrollTop + windowHeight >= documentHeight - 100;
      setIsAtBottom(atBottom);
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    if (isAtBottom) {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Scroll to content section
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 cursor-pointer group"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      aria-label={isAtBottom ? "Scroll to top" : "Scroll down"}
    >
      <motion.div
        animate={{
          y: isAtBottom ? [0, -10, 0] : [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex flex-col items-center gap-2"
      >
        <div className={`w-6 h-10 border-2 border-neutral-400 dark:border-neutral-600 rounded-full flex p-2 group-hover:border-neutral-600 dark:group-hover:border-neutral-400 transition-colors ${
          isAtBottom ? "items-end justify-center" : "items-start justify-center"
        }`}>
          <motion.div
            animate={{
              y: isAtBottom ? [0, -12, 0] : [0, 12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1.5 h-1.5 bg-neutral-600 dark:bg-neutral-400 rounded-full"
          />
        </div>
        {isAtBottom ? (
          <ChevronUp className="w-5 h-5 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors" />
        )}
      </motion.div>
    </motion.button>
  );
}
