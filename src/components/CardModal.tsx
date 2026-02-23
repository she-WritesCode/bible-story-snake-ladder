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
    bgColor = "bg-[#fdfbf7]";
    borderColor = "border-[#8c7355]";
    headerColor = "text-[#5c4a3d]";
  } else if (card.type === "PROVIDENCE") {
    bgColor = "bg-yellow-50";
    borderColor = "border-yellow-400";
    headerColor = "text-yellow-800";
  } else if (card.type === "TEMPTATION") {
    bgColor = "bg-red-50";
    borderColor = "border-red-800";
    headerColor = "text-red-900";
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
              <h3 className="text-xl font-semibold mt-2 text-gray-800">
                {card.title}
              </h3>
            </div>

            <div className="mb-8 text-lg text-gray-700 leading-relaxed text-center font-medium">
              {card.description}
              {card.question && (
                <div className="mt-4 font-bold text-gray-900">
                  {card.question}
                </div>
              )}
            </div>

            {(card.type === "WISDOM" || card.type === "TEMPTATION") &&
              card.options && (
                <div className="flex flex-col gap-3">
                  {card.options.map((option, idx) => {
                    let btnClass =
                      "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50";
                    let icon = null;

                    if (selectedOption === option) {
                      if (isCorrect) {
                        btnClass =
                          "bg-green-100 border-green-500 text-green-800";
                        icon = <Check className="w-5 h-5 text-green-600" />;
                      } else {
                        btnClass = "bg-red-100 border-red-500 text-red-800";
                        icon = <X className="w-5 h-5 text-red-600" />;
                      }
                    } else if (
                      selectedOption !== null &&
                      option === card.answer
                    ) {
                      btnClass = "bg-green-50 border-green-400 text-green-700";
                      icon = <Check className="w-5 h-5 text-green-500" />;
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(option)}
                        disabled={selectedOption !== null}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold ${btnClass}`}
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
                  className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold uppercase tracking-wider hover:bg-indigo-700 transition-colors shadow-lg"
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
