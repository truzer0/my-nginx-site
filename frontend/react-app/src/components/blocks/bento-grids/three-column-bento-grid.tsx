"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef, useId } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { IconUpload } from "@tabler/icons-react";

export function ThreeColumnBentoGrid() {
  return (
    <div className="mx-auto my-20 w-full max-w-7xl px-4 md:px-8">
      <h2 className="text-bold text-neutral-800 font-sans text-xl font-bold tracking-tight md:text-4xl dark:text-neutral-100">
        The perfect ATS score platform
      </h2>
      <p className="mt-4 max-w-lg text-sm text-neutral-600 dark:text-neutral-400">
        Get the most accurate details on your candidate with our state of the
        art, blazing fast, absolutely zero fact based ATS score generator.
      </p>
      <div className="mt-20 grid grid-flow-col grid-cols-1 grid-rows-6 gap-2 md:grid-cols-2 md:grid-rows-3 xl:grid-cols-3 xl:grid-rows-2">
        <Card className="row-span-2">
          <CardContent>
            <CardTitle>Generate scores based on pictures</CardTitle>
            <CardDescription>
              Rate your candidate&apos;s looks. As real as ATS scores.
            </CardDescription>
          </CardContent>
          <CardSkeletonBody>
            <SkeletonOne />
          </CardSkeletonBody>
        </Card>
        <Card className="overflow-hidden">
          <CardContent>
            <CardTitle>Track progress</CardTitle>
            <CardDescription>
              Track every step of the candidate&apos;s journey, from initial
              application to rejected appraisal.
            </CardDescription>
          </CardContent>
          <CardSkeletonBody>
            <SkeletonTwo />
          </CardSkeletonBody>
        </Card>
        <Card>
          <CardContent>
            <CardTitle>Schedule interviews seamlessly</CardTitle>
            <CardDescription>
              Ask about DSA or Dev, we don&apos;t care.
            </CardDescription>
          </CardContent>
          <CardSkeletonBody className="">
            <SkeletonThree />
          </CardSkeletonBody>
        </Card>
        <Card className="row-span-2">
          <CardContent>
            <CardTitle>Easy upload resumes manually</CardTitle>
            <CardDescription>
              One click OR drag and drop candidate&apos;s resumes.
            </CardDescription>
          </CardContent>
          <CardSkeletonBody className="h-full max-h-full overflow-hidden">
            <SkeletonFour />
          </CardSkeletonBody>
        </Card>
      </div>
    </div>
  );
}

const SkeletonOne = () => {
  const avatars = [
    { src: "https://assets.aceternity.com/pro/headshots/headshot-1.png", score: 69 },
    { src: "https://assets.aceternity.com/pro/headshots/headshot-2.png", score: 94 },
    { src: "https://assets.aceternity.com/pro/headshots/headshot-3.png", score: 92 },
    { src: "https://assets.aceternity.com/pro/headshots/headshot-4.png", score: 98 },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const active = avatars[activeIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % avatars.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 justify-center gap-4">
        {avatars.map((avatar, index) => (
          <motion.div
            key={`avatar-${index}`}
            className="relative"
            animate={{
              opacity: index === activeIndex ? 1 : 0.5,
              filter: index === activeIndex ? "none" : "grayscale(100%)",
              scale: index === activeIndex ? 0.95 : 1,
            }}
            transition={{ duration: 1 }}
          >
            {index === activeIndex && (
              <>
                <motion.div layoutId="highlighter" className="absolute inset-0">
                  <div className="absolute -left-px -top-px h-4 w-4 rounded-tl-lg border-l-2 border-t-2 border-blue-500" />
                  <div className="absolute -right-px -top-px h-4 w-4 rounded-tr-lg border-r-2 border-t-2 border-blue-500" />
                  <div className="absolute -bottom-px -left-px h-4 w-4 rounded-bl-lg border-b-2 border-l-2 border-blue-500" />
                  <div className="absolute -bottom-px -right-px h-4 w-4 rounded-br-lg border-b-2 border-r-2 border-blue-500" />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-x-0 bottom-4 m-auto w-fit rounded-md border border-neutral-100 bg-white px-2 py-1 text-xs text-black"
                >
                  score <span className="font-bold">{avatar.score}</span>
                </motion.span>
              </>
            )}
            <Image
              src={avatar.src}
              alt="avatar"
              width={100}
              height={140}
              className="h-[200px] w-full rounded-lg object-cover object-top"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const SkeletonTwo = () => {
  const CircleWithLine = () => (
    <div className="flex flex-col items-center justify-center">
      <div className="h-3 w-3 rounded-full border border-neutral-200 bg-neutral-100 dark:border-neutral-600" />
      <svg width="2" height="265" className="h-full">
        <path d="M1 265V1" stroke="currentColor" strokeOpacity="0.1" />
      </svg>
    </div>
  );

  return (
    <div className="relative flex h-40 flex-col overflow-hidden px-2 py-8">
      <div className="absolute inset-0 flex gap-4">
        {Array.from({ length: 13 }).map((_, i) => (
          <CircleWithLine key={`line-${i}`} />
        ))}
      </div>
      <div className="ml-20 mt-2 rounded-lg border border-neutral-100 p-1 shadow-sm">
        <div className="rounded-md bg-neutral-100 px-2 py-2 text-xs">Application Submitted</div>
      </div>
      <div className="ml-40 mt-4 rounded-lg border border-neutral-100 p-1 shadow-sm">
        <div className="rounded-md bg-neutral-100 px-2 py-2 text-xs">Interview started</div>
      </div>
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <div className="relative pb-4">
      <div className="mx-auto grid max-w-[calc(100%-4rem)] grid-cols-2 gap-4">
        <div className="rounded-lg border border-neutral-200 p-2">
          <Image
            src="https://assets.aceternity.com/pro/headshots/headshot-5.png"
            alt="avatar"
            width={100}
            height={100}
            className="h-full w-full rounded-lg object-cover"
          />
        </div>
        <div className="rounded-lg border border-neutral-200 p-2">
          <Image
            src="https://assets.aceternity.com/pro/headshots/headshot-6.png"
            alt="avatar"
            width={100}
            height={100}
            className="h-full w-full rounded-lg object-cover"
          />
        </div>
      </div>
    </div>
  );
};

const SkeletonFour = () => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => fileInputRef.current?.click();

  return (
    <div className="h-full w-full overflow-hidden">
      <div onClick={handleClick} className="relative h-full w-full cursor-pointer">
        <input ref={fileInputRef} type="file" className="hidden" />
        <div className="flex h-full items-center justify-center">
          {files.length > 0 ? (
            files.map((file) => (
              <div key={file.name} className="rounded-md bg-white p-4 shadow">
                <p className="text-xs">{file.name}</p>
              </div>
            ))
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-md bg-white shadow">
              <IconUpload className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Shared Card Components
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={cn(
      "rounded-2xl bg-white shadow dark:bg-neutral-900",
      className
    )}
  >
    {children}
  </motion.div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6">{children}</div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-100">
    {children}
  </h3>
);

const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
    {children}
  </p>
);

const CardSkeletonBody = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);
