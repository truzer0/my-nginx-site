"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

interface ImagesSliderProps {
  images: string[];
  children: React.ReactNode;
  overlay?: boolean;
  overlayClassName?: string;
  className?: string;
  autoplay?: boolean;
  direction?: "up" | "down";
  delay?: number;
}

export const ImagesSlider = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
  direction = "up",
  delay = 5000,
}: ImagesSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Загрузка изображений
  useEffect(() => {
    const loadImages = async () => {
      try {
        await Promise.all(
          images.map(
            (img) =>
              new Promise((resolve, reject) => {
                const image = new Image();
                image.src = img;
                image.onload = resolve;
                image.onerror = reject;
              })
          )
        );
        setLoaded(true);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    loadImages();
  }, [images]);

  // Автопрокрутка
  useEffect(() => {
    if (!autoplay || !loaded) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, delay);

    return () => clearInterval(interval);
  }, [autoplay, delay, images.length, loaded]);

  // Варианты анимации
  const variants = {
    enter: { opacity: 0, scale: 0.8 },
    center: { opacity: 1, scale: 1 },
    exit: { 
      opacity: 0, 
      y: direction === "up" ? "-100%" : "100%",
      transition: { duration: 0.5 }
    },
  };

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {loaded && children}
      
      {loaded && overlay && (
        <div className={cn("absolute inset-0 bg-black/60 z-40", overlayClassName)} />
      )}

      {loaded && (
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt="Slider image"
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      )}
    </div>
  );
};
