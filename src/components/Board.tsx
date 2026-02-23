import React from "react";
import { Square, EPOCHS, EpochType } from "../gameData";
import { motion } from "motion/react";
import {
  Star,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Castle,
  Tent,
  Mountain,
  Anchor,
  Compass,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface BoardProps {
  squares: Square[];
  currentSquare: number;
  focusedEpochIndex: number;
  onPan: (direction: number) => void;
  maxUnlockedEpochIndex: number;
}

export const Board: React.FC<BoardProps> = ({
  squares,
  currentSquare,
  focusedEpochIndex,
  onPan,
  maxUnlockedEpochIndex
}) => {
  const epochsList: EpochType[] = Object.keys(EPOCHS) as EpochType[];
  const focusedEpoch = epochsList[focusedEpochIndex];

  // Filter squares for the focused epoch (20 squares per epoch)
  const focusedSquares = squares.filter(s => s.epoch === focusedEpoch);

  // Organize into rows (4 rows of 5 for better layout in focused view)
  const row1 = focusedSquares.slice(0, 5);
  const row2 = focusedSquares.slice(5, 10);
  const row3 = focusedSquares.slice(10, 15);
  const row4 = focusedSquares.slice(15, 20);
  // Zig-zag pattern
  row2.reverse();
  row4.reverse();
  const rows = [row4, row3, row2, row1]; // Show higher squares on top

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8">
      {/* Epoch Navigation */}
      <div className="flex items-center gap-6 z-20">
        <button
          onClick={() => onPan(-1)}
          disabled={focusedEpochIndex === 0}
          className="p-3 bg-medieval-stone text-medieval-parchment rounded-full border-2 border-medieval-gold disabled:opacity-30 enabled:hover:bg-medieval-blood transition-colors shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center min-w-[200px]">
          <h2 className="text-2xl font-display font-black text-white tracking-widest uppercase mb-1">
            {EPOCHS[focusedEpoch].name}
          </h2>
          <div className="text-[10px] font-medieval text-medieval-stone italic">
            Chronicle Chapter {focusedEpochIndex + 1}
          </div>
        </div>

        <button
          onClick={() => onPan(1)}
          disabled={focusedEpochIndex === epochsList.length - 1 || focusedEpochIndex >= maxUnlockedEpochIndex}
          className="p-3 bg-medieval-stone text-medieval-parchment rounded-full border-2 border-medieval-gold disabled:opacity-30 enabled:hover:bg-medieval-blood transition-colors shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* The Board View */}
      <div className="relative w-full max-w-5xl medieval-scroll p-10 border-medieval-gold/50 shadow-2xl scale-110 md:scale-125">
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>

        <div className="flex flex-col gap-3 relative z-10">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-row gap-6 justify-center">
              {row.map((square) => {
                const isCurrent = currentSquare === square.id;
                let icon = null;
                let squareClass = "border-2 border-medieval-stone/20 hover:border-medieval-gold transition-all duration-500 scale-100";

                if (square.type === "START") {
                  icon = <Compass className="w-8 h-8 text-medieval-ink" />;
                  squareClass += " bg-medieval-gold/20 ring-2 ring-medieval-gold/40 shadow-inner";
                } else if (square.type === "FINISH") {
                  icon = <Castle className="w-8 h-8 text-medieval-blood" />;
                  squareClass += " bg-medieval-gold/40 shadow-xl";
                } else if (square.type === "GATE") {
                  icon = <Castle className="w-6 h-6 text-white" />;
                  squareClass += " bg-medieval-ink";
                } else if (square.type === "SNAKE") {
                  icon = <img src="/realistic_snake.png" alt="Snake" className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-xl" />;
                  squareClass += " bg-medieval-blood/30";
                } else if (square.type === "LADDER") {
                  icon = <img src="/rustic_ladder.png" alt="Ladder" className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-lg" />;
                  squareClass += " bg-white/20 border-medieval-gold/20";
                } else {
                  squareClass += " bg-white/10";
                }

                return (
                  <div
                    key={square.id}
                    className={`relative w-16 h-16 md:w-20 md:h-20 flex flex-col items-center justify-center ${squareClass}`}
                    style={{ borderRadius: '4px 12px 6px 10px' }}
                  >
                    <span className="absolute top-1 left-1.5 text-[10px] font-black text-medieval-ink/40 font-medieval italic italic">
                      {square.id}
                    </span>

                    {icon && <div className="z-10">{icon}</div>}

                    {isCurrent && (
                      <motion.div
                        layoutId="player"
                        className="absolute inset-0 flex items-center justify-center z-30"
                        initial={{ scale: 0, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                          {/* Realistic David Avatar */}
                          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-medieval-gold shadow-[0_0_20px_rgba(212,175,55,0.6)] overflow-hidden bg-medieval-stone z-10">
                            <img
                              src="/david_avatar.png"
                              alt="David"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {/* Divine Glow Effect */}
                          <div className="absolute inset-0 bg-medieval-gold/20 rounded-full blur-xl animate-pulse"></div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none select-none z-0">
        <Compass className="absolute top-20 right-40 w-64 h-64 text-medieval-ink rotate-12" />
        <Tent className="absolute bottom-40 left-20 w-80 h-80 text-medieval-ink -rotate-6" />
      </div>
    </div>
  );
};
