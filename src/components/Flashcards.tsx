"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Layers } from "lucide-react";
import AIDisclaimer from "./AIDisclaimer";

interface Card {
  front: string;
  back: string;
}

interface FlashcardsProps {
  cards: Card[];
  title: string;
  resourceTitle: string;
  organisation?: string;
}

export default function Flashcards({
  cards,
  title,
  resourceTitle,
  organisation,
}: FlashcardsProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards.length) {
    return <p className="text-gray-500 text-sm text-center py-8">No flashcards available.</p>;
  }

  const card = cards[index];
  const total = cards.length;

  const goNext = () => {
    setFlipped(false);
    setIndex(i => (i + 1) % total);
  };

  const goPrev = () => {
    setFlipped(false);
    setIndex(i => (i - 1 + total) % total);
  };

  const reset = () => {
    setFlipped(false);
    setIndex(0);
  };

  return (
    <div className="space-y-4">
      {/* AI Disclaimer */}
      <AIDisclaimer
        documentName={resourceTitle}
        organisation={organisation}
        formatLabel="flashcard set"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        <span className="text-xs text-gray-500">{index + 1} / {total}</span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1 justify-center">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFlipped(false); setIndex(i); }}
            className={`w-2 h-2 rounded-full transition ${
              i === index ? "bg-emerald-400 scale-125" : "bg-gray-700 hover:bg-gray-600"
            }`}
          />
        ))}
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="cursor-pointer select-none"
      >
        <div className="relative min-h-[280px] rounded-2xl border border-gray-800 overflow-hidden transition-all duration-300">
          {/* Front */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-all duration-300 ${
              flipped ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
            } bg-gradient-to-br from-gray-900 to-gray-800`}
          >
            <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mb-4">Question</p>
            <p className="text-lg font-semibold text-white leading-relaxed">{card.front}</p>
            <p className="text-[10px] text-gray-600 mt-6">Tap to reveal answer</p>
          </div>

          {/* Back */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-all duration-300 ${
              flipped ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            } bg-gradient-to-br from-emerald-950/30 to-gray-900`}
          >
            <p className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider mb-4">Answer</p>
            <p className="text-base text-gray-200 leading-relaxed">{card.back}</p>
            <p className="text-[10px] text-gray-600 mt-6">Tap to see question</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={goPrev}
          className="p-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={reset}
          className="p-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 transition"
          title="Reset to first card"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={goNext}
          className="p-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
