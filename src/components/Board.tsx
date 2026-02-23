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
    <div className="w-full max-w-7xl mx-auto p-4 bg-[#e8dcc7] rounded-xl shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] border-8 border-[#5c4033] relative overflow-hidden">
      {/* Background Texture */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
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
                bgColor = "bg-[#8f9779]";
                icon = <Star className="w-6 h-6 text-[#2f3325]" />;
              } else if (square.type === "FINISH") {
                bgColor = "bg-[#d4af37]";
                icon = <Star className="w-6 h-6 text-[#5c4033]" />;
              } else if (square.type === "GATE") {
                bgColor = "bg-[#4682b4]";
                icon = <ShieldAlert className="w-6 h-6 text-[#1a364d]" />;
              } else if (square.type === "SNAKE") {
                bgColor = "bg-[#8b0000]";
                icon = <ArrowDownRight className="w-6 h-6 text-[#ffb6c1]" />;
              } else if (square.type === "LADDER") {
                bgColor = "bg-[#556b2f]";
                icon = <ArrowUpRight className="w-6 h-6 text-[#d4d0a5]" />;
              }

              return (
                <div
                  key={square.id}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg border-2 border-[#5c4033] flex flex-col items-center justify-center shadow-md transition-all ${bgColor}`}
                >
                  <span className="absolute top-0.5 left-0.5 text-[10px] font-bold text-[#3e2723] opacity-70 font-serif">
                    {square.id}
                  </span>
                  {icon && <div className="scale-75">{icon}</div>}
                  {square.label && square.type !== "NORMAL" && (
                    <span
                      className={`text-[6px] sm:text-[8px] text-center leading-tight px-0.5 font-bold mt-0.5 line-clamp-2 font-serif ${square.type === "SNAKE" || square.type === "LADDER" || square.type === "GATE" ? "text-white" : "text-[#3e2723]"}`}
                    >
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
