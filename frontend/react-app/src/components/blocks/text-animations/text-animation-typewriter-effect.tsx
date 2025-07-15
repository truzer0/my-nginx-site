"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";
import React from "react";

export function TextAnimationTypewriterEffectDemo() {
  return (
    <div className="mx-auto max-w-4xl p-4">
      <Text className="mb-4 text-center text-2xl font-bold tracking-tight md:text-7xl">
        Typewriter effect for engaging content.
      </Text>
      <Text
        className="mx-auto max-w-2xl text-center text-xl font-normal text-neutral-600 dark:text-neutral-600"
        delay={0.2}
      >
        This animation mimics the classic typewriter effect, revealing text one character at a time.
      </Text>

      <div className="mt-8 flex flex-col justify-center gap-4 md:flex-row">
        <motion.button
          className="rounded-full bg-black px-6 py-3 text-white transition-colors hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          Get Started
        </motion.button>
        <motion.button
          className="rounded-full border border-black px-6 py-3 text-black transition-colors hover:bg-black/5 dark:border-white dark:text-white dark:hover:bg-white/5"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1 }}
        >
          Learn More
        </motion.button>
      </div>
    </div>
  );
}

const Text = ({
  children,
  className,
  delay = 0,
  ...animationProps
}: {
  children: string;
  className?: string;
  delay?: number;
} & MotionProps) => {
  return (
    <motion.p
      {...animationProps}
      className={cn("text-4xl font-medium", className)}
    >
      {children.split("").map((char, index) => (
        <motion.span
          key={`char-${index}-${char}`}
          initial={{ opacity: 0 }}
          whileInView={{
            opacity: 1,
          }}
          transition={{
            duration: 0.05,
            delay: delay + index * 0.03,
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.p>
  );
};
