"use client";

import React, { useState, useEffect, useId, useRef } from "react";
import { motion } from "framer-motion";

interface ContainerTextFlipProps {
  /** Array of words to cycle through in the animation */
  words?: string[];
  /** Time in milliseconds between word transitions */
  interval?: number;
  /** Additional CSS classes to apply to the container */
  className?: string;
  /** Additional CSS classes to apply to the text */
  textClassName?: string;
  /** Duration of the transition animation in milliseconds */
  animationDuration?: number;
}

export function ContainerTextFlip({
  words = ["better", "modern", "beautiful", "awesome"],
  interval = 3000,
  className = "",
  textClassName = "",
  animationDuration = 700,
}: ContainerTextFlipProps) {
  const id = useId();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [width, setWidth] = useState(100);
  const textRef = useRef<HTMLDivElement>(null);

  // Ensure words is always an array with at least one element
  const safeWords = words?.length ? words : ["default"];
  const currentWord = safeWords[currentWordIndex % safeWords.length] || "";

  const updateWidthForWord = () => {
    if (textRef.current) {
      const textWidth = textRef.current.scrollWidth + 30;
      setWidth(textWidth);
    }
  };

  useEffect(() => {
    updateWidthForWord();
  }, [currentWordIndex]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % safeWords.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [safeWords, interval]);

  return (
    <motion.p
      layout
      layoutId={`words-here-${id}`}
      animate={{ width }}
      transition={{ duration: animationDuration / 2000 }}
      className={`relative inline-block rounded-lg pt-2 pb-3 text-center text-4xl font-bold text-black md:text-7xl dark:text-white
        bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800
        shadow-[inset_0_-1px_#d1d5db,inset_0_0_0_1px_#d1d5db,_0_4px_8px_#d1d5db]
        dark:shadow-[inset_0_-1px_#10171e,inset_0_0_0_1px_hsla(205,89%,46%,.24),_0_4px_8px_#00000052]
        ${className}`}
      key={currentWord}
    >
      <motion.div
        transition={{
          duration: animationDuration / 1000,
          ease: "easeInOut",
        }}
        className={`inline-block ${textClassName}`}
        ref={textRef}
        layoutId={`word-div-${currentWord}-${id}`}
      >
        <motion.div className="inline-block">
          {currentWord.split("").map((letter, index) => (
            <motion.span
              key={index}
              initial={{
                opacity: 0,
                filter: "blur(10px)",
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
              }}
              transition={{
                delay: index * 0.02,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.p>
  );
}
