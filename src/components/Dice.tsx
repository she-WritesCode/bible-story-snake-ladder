import React, { useState } from "react";
import { motion } from "motion/react";
import { Dices } from "lucide-react";

interface DiceProps {
  onRoll: (value: number) => void;
  disabled: boolean;
}

export const Dice: React.FC<DiceProps> = ({ onRoll, disabled }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [value, setValue] = useState<number | null>(null);

  const handleRoll = () => {
    if (disabled || isRolling) return;
    setIsRolling(true);

    // Simulate rolling animation
    let rolls = 0;
    const interval = setInterval(() => {
      setValue(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls > 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setValue(finalValue);
        setIsRolling(false);
        onRoll(finalValue);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={handleRoll}
        disabled={disabled || isRolling}
        className={`relative w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl border-4 transition-colors ${
          disabled
            ? "bg-gray-300 border-gray-400 cursor-not-allowed"
            : "bg-white border-indigo-600 cursor-pointer hover:bg-indigo-50"
        }`}
      >
        {value ? (
          <span className="text-4xl font-bold text-indigo-800">{value}</span>
        ) : (
          <Dices
            className={`w-12 h-12 ${disabled ? "text-gray-500" : "text-indigo-600"}`}
          />
        )}
      </motion.button>
      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
        {disabled ? "Wait..." : "Roll Dice"}
      </span>
    </div>
  );
};
