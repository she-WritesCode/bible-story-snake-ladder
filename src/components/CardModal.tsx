import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "../gameData";
import { X, Check } from "lucide-react";

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

  let bgColor = "bg-white";
  let borderColor = "border-gray-200";
  let headerColor = "text-gray-900";

  if (card.type === "WISDOM") {
    bgColor = "bg-[#e8dcc7]";
    borderColor = "border-[#5c4033]";
    headerColor = "text-[#3e2723]";
  } else if (card.type === "PROVIDENCE") {
    bgColor = "bg-[#d4d0a5]";
    borderColor = "border-[#8f9779]";
    headerColor = "text-[#2f3325]";
  } else if (card.type === "TEMPTATION") {
    bgColor = "bg-[#c29b9b]";
    borderColor = "border-[#8b0000]";
    headerColor = "text-[#3e2723]";
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-md p-8 rounded-2xl shadow-2xl border-4 ${bgColor} ${borderColor}`}
          >
            <div className="text-center mb-6">
              <h2
                className={`text-2xl font-bold uppercase tracking-widest ${headerColor} font-serif`}
              >
                {card.type === "WISDOM"
                  ? "The Prophet's Scroll"
                  : card.type === "PROVIDENCE"
                    ? "Divine Favor"
                    : "The Tempter's Trap"}
              </h2>
              <h3 className="text-xl font-semibold mt-2 text-[#3e2723] font-serif">
                {card.title}
              </h3>
            </div>

            <div className="mb-8 text-lg text-[#5c4033] leading-relaxed text-center font-medium font-serif">
              {card.description}
              {card.question && (
                <div className="mt-4 font-bold text-[#3e2723]">
                  {card.question}
                </div>
              )}
            </div>

            {(card.type === "WISDOM" || card.type === "TEMPTATION") &&
              card.options && (
                <div className="flex flex-col gap-3">
                  {card.options.map((option, idx) => {
                    let btnClass =
                      "bg-[#e8dcc7] border-2 border-[#5c4033] text-[#3e2723] hover:bg-[#d4d0a5]";
                    let icon = null;

                    if (selectedOption === option) {
                      if (isCorrect) {
                        btnClass =
                          "bg-[#8f9779] border-[#2f3325] text-[#2f3325]";
                        icon = <Check className="w-5 h-5 text-[#2f3325]" />;
                      } else {
                        btnClass =
                          "bg-[#c29b9b] border-[#8b0000] text-[#3e2723]";
                        icon = <X className="w-5 h-5 text-[#8b0000]" />;
                      }
                    } else if (
                      selectedOption !== null &&
                      option === card.answer
                    ) {
                      btnClass = "bg-[#d4d0a5] border-[#8f9779] text-[#2f3325]";
                      icon = <Check className="w-5 h-5 text-[#2f3325]" />;
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(option)}
                        disabled={selectedOption !== null}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold font-serif ${btnClass}`}
                      >
                        <span>{option}</span>
                        {icon}
                      </button>
                    );
                  })}
                </div>
              )}

            {card.type !== "WISDOM" && card.type !== "TEMPTATION" && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleAcknowledge}
                  className="px-8 py-3 bg-[#8b0000] text-[#e8dcc7] rounded-full font-bold uppercase tracking-wider hover:bg-[#5c4033] transition-colors shadow-lg border-2 border-[#d4af37] font-serif"
                >
                  Continue
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
