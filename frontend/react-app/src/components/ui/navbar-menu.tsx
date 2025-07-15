"use client";
import React from "react";
import { motion } from "framer-motion";

const springTransition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

interface MenuItemProps {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: MenuItemProps) => {
  return (
    <div 
      onMouseEnter={() => setActive(item)} 
      className="relative"
    >
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-black hover:opacity-90 dark:text-white"
      >
        {item}
      </motion.p>

      {active === item && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={springTransition}
          className="absolute top-[calc(100%+1.2rem)] left-1/2 -translate-x-1/2 pt-4"
        >
          <motion.div
            transition={springTransition}
            layoutId="active"
            className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/20 dark:border-white/20 shadow-xl"
          >
            <motion.div layout className="w-max h-full p-4">
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

interface MenuProps {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}

export const Menu = ({ setActive, children }: MenuProps) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full border border-transparent dark:bg-black dark:border-white/20 bg-white shadow-input flex justify-center gap-4 px-8 py-6"
    >
      {children}
    </nav>
  );
};

interface ProductItemProps {
  title: string;
  description: string;
  href: string;
  src: string;
}

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: ProductItemProps) => {
  return (
    <a href={href} className="flex gap-2">
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </a>
  );
};

interface HoveredLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

export const HoveredLink = ({ children, ...rest }: HoveredLinkProps) => {
  return (
    <a
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-black"
    >
      {children}
    </a>
  );
};
