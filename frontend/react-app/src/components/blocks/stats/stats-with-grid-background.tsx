"use client";
import React, { useState, useEffect } from "react";

export function TextAnimationFlippingWords({
  words,
  duration = 3000,
}: {
  words: string[];
  duration?: number;
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Гарантируем, что words всегда будет массивом с хотя бы одним элементом
  const safeWords = words?.length ? words : [""];
  const currentWord = safeWords[currentWordIndex] || "";

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting && visibleCharacters < currentWord.length) {
      // Режим печати - добавляем символы
      timeout = setTimeout(() => {
        setVisibleCharacters((prev) => prev + 1);
      }, 100);
    } else if (isDeleting && visibleCharacters > 0) {
      // Режим удаления - удаляем символы
      timeout = setTimeout(() => {
        setVisibleCharacters((prev) => prev - 1);
      }, 100);
    } else if (!isDeleting && visibleCharacters === currentWord.length) {
      // Переход к удалению после полной печати
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, duration);
    } else if (isDeleting && visibleCharacters === 0) {
      // Переход к следующему слову после полного удаления
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % safeWords.length);
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [visibleCharacters, isDeleting, currentWord, duration, safeWords.length]);

  return (
    <div className="inline-flex flex-col items-center justify-center">
      <span className="relative block h-12 text-center sm:h-16">
        <span className="absolute inset-0 block overflow-hidden text-center font-bold text-neutral-900 dark:text-neutral-100">
          {currentWord.substring(0, visibleCharacters)}
          <span className="ml-1 inline-block h-6 w-1 animate-pulse bg-current align-middle sm:h-8" />
        </span>
      </span>
      <span className="mt-2 block h-4 text-sm text-neutral-500 dark:text-neutral-400">
        {`${currentWordIndex + 1}/${safeWords.length}`}
      </span>
    </div>
  );
}

// Пример использования:
// <TextAnimationFlippingWords words={["React", "Next.js", "TypeScript"]} duration={2000} />
