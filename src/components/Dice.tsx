import React, { useState } from "react";
import { motion } from "motion/react";
import { Dices, Sparkles } from "lucide-react";

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
    <div className="flex flex-col items-center gap-6">
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05, rotate: disabled ? 0 : 2 }}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
        onClick={handleRoll}
        disabled={disabled || isRolling}
        className={`relative w-28 h-28 rounded-sm flex items-center justify-center shadow-2xl border-[6px] transition-all duration-300 ${disabled
            ? "bg-medieval-stone/40 border-medieval-stone/60 cursor-not-allowed opacity-50 grayscale"
            : "bg-medieval-parchment border-medieval-blood cursor-pointer hover:border-medieval-gold hover:shadow-medieval-gold/20"
          }`}
        style={{
          boxShadow: !disabled ? '0 10px 30px rgba(139, 0, 0, 0.3), inset 0 0 20px rgba(0,0,0,0.1)' : undefined
        }}
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] pointer-events-none"></div>

        {value ? (
          <motion.span
            key={value}
            initial={{ scale: 0.5, rotate: -45 }}
            animate={{ scale: 1.2, rotate: 0 }}
            className="text-5xl font-black text-medieval-ink font-display"
          >
            {value}
          </motion.span>
        ) : (
          <Dices
            className={`w-14 h-14 ${disabled ? "text-medieval-stone" : "text-medieval-blood animate-pulse"}`}
          />
        )}

        {!disabled && !isRolling && (
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-6 h-6 text-medieval-gold" />
          </motion.div>
        )}
      </motion.button>

      <div className="flex flex-col items-center gap-1">
        <span className={`text-sm font-bold uppercase tracking-[0.3em] font-display transition-colors ${disabled ? 'text-medieval-stone' : 'text-medieval-gold'}`}>
          {isRolling ? "Divining..." : disabled ? "Wait Thy Turn" : "Cast Lots"}
        </span>
        <div className={`h-1 w-12 bg-medieval-stone/20 rounded-full overflow-hidden ${!disabled && !isRolling ? 'relative' : ''}`}>
          {!disabled && !isRolling && <motion.div animate={{ x: [-50, 50] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute inset-0 bg-medieval-gold/50" />}
        </div>
      </div>
    </div>
  );
};
