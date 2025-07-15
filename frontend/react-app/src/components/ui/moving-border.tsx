"use client";
import React, { useRef } from "react";
import { 
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform 
} from "framer-motion";
import { cn } from "@/lib/utils";

interface MovingBorderProps {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  className?: string;
}

export const MovingBorder = ({
  children,
  duration = 3000,
  rx = "30%",
  ry = "30%",
  className,
  ...props
}: MovingBorderProps) => {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue(0);

  useAnimationFrame((time) => {
    if (!pathRef.current) return;
    const length = pathRef.current.getTotalLength();
    const pxPerMillisecond = length / duration;
    progress.set((time * pxPerMillisecond) % length);
  });

  const x = useTransform(progress, (val) => {
    return pathRef.current?.getPointAtLength(val).x || 0;
  });

  const y = useTransform(progress, (val) => {
    return pathRef.current?.getPointAtLength(val).y || 0;
  });

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} {...props}>
      <svg className="absolute h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect
          fill="none"
          width="100"
          height="100"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        className="absolute"
        style={{
          transform,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderRadius?: string;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
}

export function Button({
  borderRadius = "1.75rem",
  children,
  containerClassName,
  borderClassName,
  duration,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "relative h-16 w-40 overflow-hidden bg-transparent p-[1px] text-xl",
        containerClassName
      )}
      style={{ borderRadius }}
      {...props}
    >
      <div 
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration}>
          <div className={cn(
            "h-20 w-20 bg-[radial-gradient(#0ea5e9_40%,transparent_60%)] opacity-[0.8]",
            borderClassName
          )}/>
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center border border-slate-800 bg-slate-900/[0.8] text-sm text-white antialiased backdrop-blur-xl",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </button>
  );
}
