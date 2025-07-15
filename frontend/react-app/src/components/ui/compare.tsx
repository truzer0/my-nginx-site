"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { IconDotsVertical } from "@tabler/icons-react";

interface CompareProps {
  firstImage?: string;
  secondImage?: string;
  className?: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  initialSliderPercentage?: number;
  slideMode?: "hover" | "drag";
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
}

export const Compare = ({
  firstImage = "",
  secondImage = "",
  className,
  firstImageClassName,
  secondImageClassname,
  initialSliderPercentage = 50,
  slideMode = "hover",
  showHandlebar = true,
  autoplay = false,
  autoplayDuration = 5000,
}: CompareProps) => {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = useCallback(() => {
    if (!autoplay) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress =
        (elapsedTime % (autoplayDuration * 2)) / autoplayDuration;
      const percentage = progress <= 1 ? progress * 100 : (2 - progress) * 100;

      setSliderXPercent(percentage);
      autoplayRef.current = setTimeout(animate, 16);
    };

    animate();
  }, [autoplay, autoplayDuration]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  const mouseEnterHandler = useCallback(() => {
    setIsMouseOver(true);
    stopAutoplay();
  }, [stopAutoplay]);

  const mouseLeaveHandler = useCallback(() => {
    setIsMouseOver(false);
    if (slideMode === "hover") {
      setSliderXPercent(initialSliderPercentage);
    }
    if (slideMode === "drag") {
      setIsDragging(false);
    }
    startAutoplay();
  }, [slideMode, initialSliderPercentage, startAutoplay]);

  const handleStart = useCallback(
    (clientX: number) => {
      if (slideMode === "drag") {
        setIsDragging(true);
      }
    },
    [slideMode]
  );

  const handleEnd = useCallback(() => {
    if (slideMode === "drag") {
      setIsDragging(false);
    }
  }, [slideMode]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
        const percent = (x / rect.width) * 100;
        setSliderXPercent(percent);
      }
    },
    [slideMode, isDragging]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleStart(e.clientX);
    },
    [handleStart]
  );

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      handleMove(e.clientX);
    },
    [handleMove]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!autoplay && e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        if (touch) {
          handleStart(touch.clientX);
        }
      }
    },
    [handleStart, autoplay]
  );

  const handleTouchEnd = useCallback(() => {
    if (!autoplay) {
      handleEnd();
    }
  }, [handleEnd, autoplay]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!autoplay && e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        if (touch) {
          handleMove(touch.clientX);
        }
      }
    },
    [handleMove, autoplay]
  );

  return (
    <div
      ref={sliderRef}
      className={cn("w-[400px] h-[400px] overflow-hidden", className)}
      style={{
        position: "relative",
        cursor: slideMode === "drag" ? "grab" : "col-resize",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={mouseLeaveHandler}
      onMouseEnter={mouseEnterHandler}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <AnimatePresence initial={false}>
        <motion.div
          className="h-full w-px absolute top-0 m-auto z-30 bg-gradient-to-b from-transparent from-[5%] to-[95%] via-indigo-500 to-transparent"
          style={{
            left: `${sliderXPercent}%`,
            top: "0",
            zIndex: 40,
          }}
          transition={{ duration: 0 }}
        >
          {showHandlebar && (
            <div className="h-5 w-5 rounded-md top-1/2 -translate-y-1/2 bg-white z-30 -right-2.5 absolute flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40]">
              <IconDotsVertical className="h-4 w-4 text-black" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      
      {firstImage && (
        <div className="overflow-hidden w-full h-full relative z-20 pointer-events-none">
          <motion.div
            className={cn(
              "absolute inset-0 z-20 rounded-2xl shrink-0 w-full h-full select-none overflow-hidden",
              firstImageClassName
            )}
            style={{
              clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)`,
            }}
            transition={{ duration: 0 }}
          >
            <img
              alt="first image"
              src={firstImage}
              className={cn(
                "absolute inset-0 z-20 rounded-2xl shrink-0 w-full h-full select-none",
                firstImageClassName
              )}
              draggable={false}
            />
          </motion.div>
        </div>
      )}

      {secondImage && (
        <motion.img
          className={cn(
            "absolute top-0 left-0 z-[19] rounded-2xl w-full h-full select-none",
            secondImageClassname
          )}
          alt="second image"
          src={secondImage}
          draggable={false}
        />
      )}
    </div>
  );
};

const MemoizedSparklesCore = React.memo(SparklesCore);
