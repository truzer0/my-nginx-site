"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface FlippingTextProps {
  words: string[];
  className?: string;
}

const FlippingText = ({ words, className }: FlippingTextProps) => {
  // Гарантируем, что words всегда будет массивом с хотя бы одним элементом
  const safeWords = words?.length ? words : [""];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentWord = safeWords[currentWordIndex] || "";

  useEffect(() => {
    const typingSpeed = 50;
    const deletingSpeed = 50;
    const pauseBeforeDelete = 1000;

    let timeout: NodeJS.Timeout;

    if (!isDeleting && visibleCharacters < currentWord.length) {
      timeout = setTimeout(() => {
        setVisibleCharacters((prev) => prev + 1);
      }, typingSpeed);
    } else if (!isDeleting && visibleCharacters === currentWord.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseBeforeDelete);
    } else if (isDeleting && visibleCharacters > 0) {
      timeout = setTimeout(() => {
        setVisibleCharacters((prev) => prev - 1);
      }, deletingSpeed);
    } else if (isDeleting && visibleCharacters === 0) {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % safeWords.length);
    }

    return () => clearTimeout(timeout);
  }, [currentWord, currentWordIndex, isDeleting, visibleCharacters, safeWords.length]);

  return (
    <span className={cn("relative inline-block", className)}>
      <span className="tracking-tighter">
        {currentWord
          .substring(0, visibleCharacters)
          .split("")
          .map((char, index) => (
            <motion.span
              key={`${index}-${char}`}
              initial={{ opacity: 0, rotateY: 90, y: 10, filter: "blur(10px)" }}
              animate={{ opacity: 1, rotateY: 0, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, rotateY: -90, y: -10, filter: "blur(10px)" }}
              transition={{ duration: 0.3 }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
      </span>
      <motion.span
        layout
        className="absolute -right-4 bottom-2 inline-block rounded-full bg-black"
        style={{
          width: isDeleting ? "0.45em" : "0.25em",
          height: "0.25em",
        }}
        animate={{
          backgroundColor: isDeleting
            ? "#ef4444"
            : ["#60a5fa", "#22c55e", "#3b82f6"],
        }}
        transition={{ duration: 0.1 }}
      />
    </span>
  );
};

export function TextAnimationFlippingWords() {
  const words = ["Next.js", "Tailwind CSS", "Motion", "Typescript", "Web GL"];

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 md:grid-cols-2 md:px-8">
      <div>
        <h1 className="mb-4 text-left text-2xl font-bold md:text-5xl">
          Built with <FlippingText words={words} />
        </h1>
        <p className="mt-4 text-left text-base text-neutral-600 dark:text-neutral-400">
          Create stunning animations that bring your website to life.
        </p>
        <LogoCloud />
      </div>
      <IphoneMockup>
        <div className="flex flex-col space-y-4 overflow-y-auto p-4">
          {[
            {
              title: "Getting Started",
              description: "Learn how to build your first animation in minutes",
              icon: "🚀",
            },
            // ... другие карточки
          ].map((card, index) => (
            <div
              key={index}
              className="rounded-xl bg-white p-4 shadow-md transition-all hover:shadow-lg dark:bg-neutral-800"
            >
              <div className="flex items-start space-x-3">
                <div className="text-xl">{card.icon}</div>
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                    {card.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </IphoneMockup>
    </div>
  );
};

const LogoCloud = () => {
  const logos = [
    {
      name: "Aceternity UI",
      src: "https://assets.aceternity.com/pro/logos/aceternity-ui.png",
    },
    // ... другие логотипы
  ];

  return (
    <div className="mt-8">
      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
        Trusted by leading companies
      </p>
      <div className="mt-4 flex flex-wrap gap-6">
        {logos.map((logo) => (
          <div key={logo.name} className="flex items-center">
            <img
              src={logo.src}
              alt={logo.name}
              className="h-10 w-auto object-contain transition-all dark:invert dark:filter"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

interface IphoneMockupProps {
  image?: string;
  children?: React.ReactNode;
}

export const IphoneMockup = ({ image, children }: IphoneMockupProps) => {
  return (
    <div className="relative mx-auto h-[600px] w-[300px] md:h-[680px] md:w-[340px]">
      {/* iPhone frame и другие элементы */}
      <div className="absolute inset-0 rounded-[50px] border-[14px] border-black bg-black shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
        {/* ... остальная реализация iPhone mockup */}
        <div className="relative h-full w-full overflow-hidden rounded-[35px] bg-white dark:bg-neutral-950">
          <div className="absolute inset-0 top-[2.3rem]">
            {image && (
              <img 
                src={image} 
                alt="App screenshot" 
                className="object-cover"
                loading="lazy"
              />
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
