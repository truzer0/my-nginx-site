import React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const PATH = "M0.5 0.980671L0.5 1566.02";

const MovingLine = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["end end", "start start"]
  });

  const pathLength = useSpring(
    useTransform(scrollYProgress, [0, 1], [1, 0]),
    { stiffness: 500, damping: 100 }
  );

  return (
    <div 
      ref={containerRef}
      className="max-w-4xl mx-auto flex flex-row gap-10 items-start w-full"
    >
      <svg
        width="1"
        height="1567"
        viewBox="0 0 1 1567"
        fill="none"
        className="shrink-0"
      >
        <defs>
          <linearGradient
            id="line-gradient"
            x1="1" y1="-102.823"
            x2="1" y2="1566.02"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3879E7" stopOpacity="0" />
            <stop offset="1" stopColor="#3879E7" />
          </linearGradient>
        </defs>
        
        <motion.path
          d={PATH}
          stroke="var(--blue-500)"
          strokeOpacity="1"
          strokeLinecap="round"
          strokeWidth="3"
          style={{ pathLength }}
        />
      </svg>

      <div className="flex flex-col w-full gap-10">
        <Content />
        <Content />
        <Content />
      </div>
    </div>
  );
};

const Content = () => (
  <div className="w-full mb-10">
    <h3 className="text-2xl font-bold text-white">
      The path follows the scroll
    </h3>
    <p className="text-base font-normal text-neutral-300">
      If you look closely, you can see the path is being animated.
    </p>
    <div className="flex gap-4 w-full mt-4">
      <div className="w-full h-40 md:h-96 rounded-md bg-gradient-to-tr from-slate-800 to-slate-700" />
      <div className="w-full h-40 md:h-96 rounded-md bg-gradient-to-tr from-slate-800 to-slate-700" />
    </div>
  </div>
);

export default MovingLine;
