import React from "react";
import { Square, EPOCHS } from "../gameData";
import { motion } from "motion/react";
import {
  Flag,
  Star,
  Skull,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface BoardProps {
  squares: Square[];
  currentSquare: number;
}

export const Board: React.FC<BoardProps> = ({ squares, currentSquare }) => {
  // We want to render the board in a winding path (boustrophedon)
  // 10 rows of 10 squares.
  // Row 1 (bottom): 1 to 10
  // Row 2: 20 to 11
  // ...
  // Row 10 (top): 91 to 100

  const rows = [];
  for (let i = 0; i < 10; i++) {
    const rowSquares = squares.slice(i * 10, (i + 1) * 10);
    if (i % 2 !== 0) {
      rowSquares.reverse();
    }
    rows.push(rowSquares);
  }
  rows.reverse(); // Put row 10 at the top

  return (
    <div className="w-full max-w-5xl mx-auto p-4 bg-[#fdfbf7] rounded-xl shadow-2xl border-4 border-[#8c7355] relative overflow-hidden">
      {/* Background Texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'url("https://www.transparenttextures.com/patterns/aged-paper.png")',
        }}
      ></div>

      <div className="flex flex-col gap-2 relative z-10">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-row gap-2 justify-center">
            {row.map((square) => {
              const epochInfo = EPOCHS[square.epoch];
              const isCurrent = currentSquare === square.id;

              let bgColor = epochInfo.bgClass;
              let icon = null;

              if (square.type === "START") {
                bgColor = "bg-green-300";
                icon = <Star className="w-6 h-6 text-green-800" />;
              } else if (square.type === "FINISH") {
                bgColor = "bg-yellow-400";
                icon = <Star className="w-6 h-6 text-yellow-800" />;
              } else if (square.type === "GATE") {
                bgColor = "bg-blue-300";
                icon = <ShieldAlert className="w-6 h-6 text-blue-800" />;
              } else if (square.type === "SNAKE") {
                bgColor = "bg-red-200";
                icon = <ArrowDownRight className="w-6 h-6 text-red-600" />;
              } else if (square.type === "LADDER") {
                bgColor = "bg-emerald-200";
                icon = <ArrowUpRight className="w-6 h-6 text-emerald-600" />;
              }

              return (
                <div
                  key={square.id}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg border-2 border-[#8c7355] flex flex-col items-center justify-center shadow-md transition-all ${bgColor}`}
                >
                  <span className="absolute top-0.5 left-0.5 text-[10px] font-bold text-gray-700 opacity-50">
                    {square.id}
                  </span>
                  {icon && <div className="scale-75">{icon}</div>}
                  {square.label && square.type !== "NORMAL" && (
                    <span className="text-[6px] sm:text-[8px] text-center leading-tight px-0.5 font-semibold text-gray-800 mt-0.5 line-clamp-2">
                      {square.label}
                    </span>
                  )}

                  {isCurrent && (
                    <motion.div
                      layoutId="player"
                      className="absolute inset-0 flex items-center justify-center z-20"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold">
                          You
                        </span>
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
  );
};
