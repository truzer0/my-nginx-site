"use client";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useRef, useId, useEffect } from "react";

interface SlideData {
  title: string;
  button: string;
  src: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const { x, y } = mousePosition.current;
      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    mousePosition.current = {
      x: event.clientX - (rect.left + Math.floor(rect.width / 2)),
      y: event.clientY - (rect.top + Math.floor(rect.height / 2)),
    };
  };

  const handleMouseLeave = () => {
    mousePosition.current = { x: 0, y: 0 };
  };

  const { src, button, title } = slide;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[70vmin] h-[70vmin] mx-[4vmin] z-10"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: current !== index ? "scale(0.98) rotateX(8deg)" : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-[1%] overflow-hidden transition-all duration-150 ease-out"
          style={{
            transform: current === index 
              ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)" 
              : "none",
          }}
        >
          <img
            className="absolute inset-0 w-[120%] h-[120%] object-cover transition-opacity duration-600 ease-in-out"
            style={{ opacity: current === index ? 1 : 0.5 }}
            alt={title}
            src={src}
            loading="eager"
            decoding="sync"
          />
          {current === index && (
            <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />
          )}
        </div>

        {current === index && (
          <article className="relative p-[4vmin] transition-opacity duration-1000 ease-in-out">
            <h2 className="text-lg md:text-2xl lg:text-4xl font-semibold relative">
              {title}
            </h2>
            <div className="flex justify-center">
              <button className="mt-6 px-4 py-2 w-fit mx-auto sm:text-sm text-black bg-white h-12 border border-transparent text-xs flex justify-center items-center rounded-2xl hover:shadow-lg transition duration-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                {button}
              </button>
            </div>
          </article>
        )}
      </li>
    </div>
  );
};

interface CarouselControlProps {
  type: "previous" | "next";
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({ type, title, handleClick }: CarouselControlProps) => (
  <button
    className={`w-10 h-10 flex items-center mx-2 justify-center bg-neutral-200 dark:bg-neutral-800 border-3 border-transparent rounded-full focus:border-[#6D64F7] focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ${
      type === "previous" ? "rotate-180" : ""
    }`}
    title={title}
    onClick={handleClick}
  >
    <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200" />
  </button>
);

interface CarouselProps {
  slides: SlideData[];
}

export default function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const carouselId = useId();

  const navigate = (direction: "previous" | "next") => {
    setCurrent(prev => 
      direction === "previous" 
        ? (prev - 1 + slides.length) % slides.length
        : (prev + 1) % slides.length
    );
  };

  return (
    <div className="relative w-[70vmin] h-[70vmin] mx-auto" aria-labelledby={`carousel-heading-${carouselId}`}>
      <ul
        className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${current * (100 / slides.length)}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            slide={slide}
            index={index}
            current={current}
            handleSlideClick={setCurrent}
          />
        ))}
      </ul>

      <div className="absolute flex justify-center w-full top-[calc(100%+1rem)]">
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={() => navigate("previous")}
        />
        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={() => navigate("next")}
        />
      </div>
    </div>
  );
}
