import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "../gameData";
import { X, Check, Scroll } from "lucide-react";

interface CardModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onAnswer: (correct: boolean) => void;
}

export const CardModal: React.FC<CardModalProps> = ({
  card,
  isOpen,
  onClose,
  onAnswer,
}) => {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null,
  );
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedOption(null);
      setIsCorrect(null);
    }
  }, [isOpen]);

  if (!card) return null;

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null) return; // Already answered

    setSelectedOption(option);
    const correct = option === card.answer;
    setIsCorrect(correct);

    setTimeout(() => {
      onAnswer(correct);
    }, 1500);
  };

  const handleAcknowledge = () => {
    onClose();
  };

  let headerLabel = "The Prophet's Scroll";
  let accentColor = "text-medieval-ink";
  let decoration = <Scroll className="w-8 h-8 opacity-20 absolute top-4 right-4" />;

  if (card.type === "PROVIDENCE") {
    headerLabel = "Divine Favor";
    accentColor = "text-[#2f3325]";
  } else if (card.type === "TEMPTATION") {
    headerLabel = "The Tempter's Trap";
    accentColor = "text-medieval-blood";
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 3 }}
            className="relative w-full max-w-lg p-12 medieval-scroll rounded-sm shadow-[0_0_100px_rgba(0,0,0,0.5)] border-x-MedievalStone"
          >
            {/* Scroll Handles (Visual Only) */}
            <div className="absolute -left-4 top-0 bottom-0 w-8 bg-medieval-stone rounded-full shadow-lg border-2 border-medieval-gold"></div>
            <div className="absolute -right-4 top-0 bottom-0 w-8 bg-medieval-stone rounded-full shadow-lg border-2 border-medieval-gold"></div>

            <div className="text-center mb-8 relative">
              {decoration}
              <h2 className={`text-3xl font-display font-black uppercase tracking-[0.2em] ${accentColor} border-b-2 border-medieval-stone/20 pb-2 mb-2`}>
                {headerLabel}
              </h2>
              <h3 className="text-xl font-medieval text-medieval-stone italic">
                {card.title}
              </h3>
            </div>

            <div className="mb-10 text-xl text-medieval-ink leading-[1.6] text-center font-medium font-serif italic hyphens-auto">
              "{card.description}"
              {card.question && (
                <div className="mt-6 font-black text-2xl text-medieval-stone not-italic font-display border-t border-medieval-stone/10 pt-4">
                  {card.question}
                </div>
              )}
            </div>

            {(card.type === "WISDOM" || card.type === "TEMPTATION") &&
              card.options && (
                <div className="flex flex-col gap-4">
                  {card.options.map((option, idx) => {
                    let btnClass = "bg-medieval-parchment/60 border-2 border-medieval-stone/30 text-medieval-ink hover:bg-medieval-gold/20 hover:border-medieval-gold shadow-md";
                    let icon = null;

                    if (selectedOption === option) {
                      if (isCorrect) {
                        btnClass = "bg-[#8f9779]/40 border-2 border-[#2f3325] text-[#2f3325] shadow-inner font-black scale-[0.98]";
                        icon = <Check className="w-6 h-6 text-[#2f3325]" />;
                      } else {
                        btnClass = "bg-medieval-blood/20 border-2 border-medieval-blood text-medieval-blood shadow-inner font-black scale-[0.98]";
                        icon = <X className="w-6 h-6 text-medieval-blood" />;
                      }
                    } else if (selectedOption !== null && option === card.answer) {
                      btnClass = "bg-[#d4d0a5]/40 border-2 border-[#8f9779] text-[#2f3325]";
                      icon = <Check className="w-6 h-6 text-[#2f3325]" />;
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(option)}
                        disabled={selectedOption !== null}
                        className={`flex items-center justify-between px-6 py-4 rounded-sm transition-all text-lg font-medieval ${btnClass}`}
                      >
                        <span className="flex-1 text-center">{option}</span>
                        <div className="w-6 h-6 flex items-center justify-center translate-x-2">
                          {icon}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

            {card.type !== "WISDOM" && card.type !== "TEMPTATION" && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleAcknowledge}
                  className="medieval-button"
                >
                  Thy Will Be Done
                </button>
              </div>
            )}

            {/* Visual Seal Overlay */}
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-medieval-blood rounded-full border-4 border-medieval-gold shadow-2xl flex items-center justify-center rotate-12 pointer-events-none">
              <span className="text-medieval-gold font-display text-2xl font-black">DJ</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
