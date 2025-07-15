"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Card {
  id: number;
  content: React.ReactNode;
  className: string;
  thumbnail: string;
}

interface LayoutGridProps {
  cards: Card[];
}

export const LayoutGrid = ({ cards }: LayoutGridProps) => {
  const [selected, setSelected] = useState<Card | null>(null);

  const handleCardClick = (card: Card) => {
    setSelected(selected?.id === card.id ? null : card);
  };

  const handleBackgroundClick = () => {
    setSelected(null);
  };

  return (
    <div className="w-full h-full p-10 grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative">
      {cards.map((card) => (
        <motion.div
          key={card.id}
          onClick={() => handleCardClick(card)}
          className={cn(
            card.className,
            "relative overflow-hidden bg-white rounded-xl h-full w-full cursor-pointer",
            selected?.id === card.id && "fixed inset-0 m-auto z-50 h-1/2 w-full md:w-1/2"
          )}
          layoutId={`card-${card.id}`}
        >
          <motion.img
            src={card.thumbnail}
            alt="Thumbnail"
            className="absolute inset-0 h-full w-full object-cover object-top"
            layoutId={`image-${card.id}`}
          />
          
          {selected?.id === card.id && (
            <motion.div 
              className="absolute inset-0 bg-black/60 z-10 flex items-end p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative z-20"
              >
                {card.content}
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      ))}

      {selected && (
        <motion.div
          onClick={handleBackgroundClick}
          className="fixed inset-0 bg-black/30 z-40 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </div>
  );
};
