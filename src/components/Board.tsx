import React, { useState, useEffect, useMemo } from "react";
import { Square, EPOCHS, EpochType } from "../gameData";
import { motion } from "motion/react";
import {
  Compass,
  ChevronLeft,
  ChevronRight,
  Castle,
  Tent
} from "lucide-react";

interface BoardProps {
  squares: Square[];
  currentSquare: number;
  focusedEpochIndex: number;
  onPan: (direction: number) => void;
  maxUnlockedEpochIndex: number;
  characterId: string;
}

export const Board: React.FC<BoardProps> = ({
  squares,
  currentSquare,
  focusedEpochIndex,
  onPan,
  maxUnlockedEpochIndex,
  characterId
}) => {
  const epochsList: EpochType[] = Object.keys(EPOCHS) as EpochType[];
  const focusedEpoch = epochsList[focusedEpochIndex];

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Constants (matching Tailwind classes)
  const PADDING = isMobile ? 24 : 40;
  const GAP = isMobile ? 16 : 24;
  const SQUARE_SIZE = isMobile ? 64 : 80;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter squares for the focused epoch
  const focusedSquares = useMemo(() => squares.filter(s => s.epoch === focusedEpoch), [squares, focusedEpoch]);

  // Organize into rows for the grid
  const rows = useMemo(() => {
    const r1 = focusedSquares.slice(0, 5);
    const r2 = [...focusedSquares.slice(5, 10)].reverse();
    const r3 = focusedSquares.slice(10, 15);
    const r4 = [...focusedSquares.slice(15, 20)].reverse();
    return [r4, r3, r2, r1];
  }, [focusedSquares]);

  // Pure mathematical coordinate calculator
  const getSquareCoord = (id: number) => {
    const epochStartId = focusedEpochIndex * 20;
    const localId = id - epochStartId - 1;

    // Check if square is in current epoch
    const inCurrentEpoch = localId >= 0 && localId < 20;

    if (!inCurrentEpoch) {
      // Return boundary point
      const isForward = id > epochStartId + 20;
      return {
        x: isForward ? PADDING + 5 * (SQUARE_SIZE + GAP) : -PADDING,
        y: PADDING + 2 * (SQUARE_SIZE + GAP),
        outOfBounds: true
      };
    }

    const rowIdx = Math.floor(localId / 5); // 0=Bottom, 3=Top
    let colIdx = localId % 5;
    if (rowIdx % 2 === 1) colIdx = 4 - colIdx; // Zig-zag reverse for rows 1 and 3

    return {
      x: PADDING + colIdx * (SQUARE_SIZE + GAP) + SQUARE_SIZE / 2,
      y: PADDING + (3 - rowIdx) * (SQUARE_SIZE + GAP) + SQUARE_SIZE / 2,
      outOfBounds: false
    };
  };

  const connections = useMemo(() => {
    return focusedSquares
      .filter(s => s.target && (s.type === "LADDER" || s.type === "SNAKE"))
      .map(s => ({
        id: s.id,
        type: s.type,
        from: getSquareCoord(s.id),
        to: getSquareCoord(s.target!)
      }));
  }, [focusedSquares, focusedEpochIndex, isMobile]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8">
      {/* Epoch Navigation */}
      <div className="flex items-center gap-6 z-30">
        <button
          onClick={() => onPan(-1)}
          disabled={focusedEpochIndex === 0}
          className="p-3 bg-medieval-stone text-medieval-parchment rounded-full border-2 border-medieval-gold disabled:opacity-30 enabled:hover:bg-medieval-blood transition-colors shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center min-w-[200px]">
          <h2 className="text-2xl font-display font-black text-medieval-ink tracking-widest uppercase mb-1">
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
      <div className="relative medieval-scroll border-medieval-gold/50 shadow-2xl scale-[0.85] md:scale-110"
        style={{
          width: 2 * PADDING + 5 * SQUARE_SIZE + 4 * GAP,
          height: 2 * PADDING + 4 * SQUARE_SIZE + 3 * GAP
        }}>

        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>

        {/* Pure SVG Connection Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[15] overflow-visible">
          <defs>
            <linearGradient id="ladderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5D2906" />
              <stop offset="50%" stopColor="#8B4513" />
              <stop offset="100%" stopColor="#5D2906" />
            </linearGradient>
            <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a4d1a" />
              <stop offset="30%" stopColor="#32cd32" />
              <stop offset="70%" stopColor="#2e7d32" />
              <stop offset="100%" stopColor="#0a2d0a" />
            </linearGradient>
            <pattern id="scalesPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <path d="M 5 0 L 10 5 L 5 10 L 0 5 Z" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
            </pattern>
            <filter id="shadow">
              <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.6" />
            </filter>
          </defs>

          {connections.map(conn => {
            const dx = conn.to.x - conn.from.x;
            const dy = conn.to.y - conn.from.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const isLadder = conn.type === "LADDER";

            if (isLadder) {
              const angle = Math.atan2(dy, dx);
              const railSpacing = isMobile ? 8 : 10;
              const rungSpacing = isMobile ? 12 : 16;
              const numRungs = Math.floor(dist / rungSpacing);

              return (
                <g key={conn.id} filter="url(#shadow)">
                  {/* Rails */}
                  <line
                    x1={conn.from.x - Math.sin(angle) * railSpacing} y1={conn.from.y + Math.cos(angle) * railSpacing}
                    x2={conn.to.x - Math.sin(angle) * railSpacing} y2={conn.to.y + Math.cos(angle) * railSpacing}
                    stroke="url(#ladderGrad)" strokeWidth={isMobile ? "4" : "6"} strokeLinecap="round"
                  />
                  <line
                    x1={conn.from.x + Math.sin(angle) * railSpacing} y1={conn.from.y - Math.cos(angle) * railSpacing}
                    x2={conn.to.x + Math.sin(angle) * railSpacing} y2={conn.to.y - Math.cos(angle) * railSpacing}
                    stroke="url(#ladderGrad)" strokeWidth={isMobile ? "4" : "6"} strokeLinecap="round"
                  />
                  {/* Rungs */}
                  {Array.from({ length: numRungs }).map((_, i) => {
                    const t = (i + 1) / (numRungs + 1);
                    const rx = conn.from.x + dx * t;
                    const ry = conn.from.y + dy * t;
                    return (
                      <line
                        key={i}
                        x1={rx - Math.sin(angle) * (railSpacing + 2)} y1={ry + Math.cos(angle) * (railSpacing + 2)}
                        x2={rx + Math.sin(angle) * (railSpacing + 2)} y2={ry - Math.cos(angle) * (railSpacing + 2)}
                        stroke="#3E1D04" strokeWidth={isMobile ? "2" : "3"} strokeLinecap="round"
                      />
                    );
                  })}
                </g>
              );
            } else {
              // Snake - Realistic Curvy Path
              const angle = Math.atan2(dy, dx);
              const cp1x = conn.from.x + dx * 0.2 - dy * 0.4;
              const cp1y = conn.from.y + dy * 0.2 + dx * 0.4;
              const cp2x = conn.from.x + dx * 0.8 + dy * 0.4;
              const cp2y = conn.from.y + dy * 0.8 - dx * 0.4;
              const path = `M ${conn.from.x} ${conn.from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${conn.to.x} ${conn.to.y}`;

              return (
                <g key={conn.id} filter="url(#shadow)">
                  {/* Main Body with Shading */}
                  <path
                    d={path}
                    fill="none"
                    stroke="url(#snakeGrad)"
                    strokeWidth={isMobile ? "12" : "18"}
                    strokeLinecap="round"
                  />
                  {/* Scales Pattern Overlay */}
                  <path
                    d={path}
                    fill="none"
                    stroke="url(#scalesPattern)"
                    strokeWidth={isMobile ? "10" : "14"}
                    strokeLinecap="round"
                  />
                  {/* Glistening Highlight (Tapered feel) */}
                  <path
                    d={path}
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth={isMobile ? "4" : "6"}
                    strokeDasharray="1 12"
                    strokeLinecap="round"
                  />

                  {/* Anatomical Head (Diamond Shape) */}
                  <g transform={`translate(${conn.from.x}, ${conn.from.y}) rotate(${angle * 180 / Math.PI})`}>
                    {/* Flickering Tongue */}
                    <motion.path
                      d="M 5 0 L 12 -2 M 5 0 L 12 2"
                      stroke="#FF0000"
                      strokeWidth="1.5"
                      fill="none"
                      animate={{ scaleX: [1, 1.3, 1], x: [0, 2, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                    />
                    {/* Head Body */}
                    <path
                      d="M -8 -6 L 8 0 L -8 6 L -12 0 Z"
                      fill="#1a4d1a"
                      stroke="#0a2d0a"
                      strokeWidth="1"
                    />
                    {/* Glowing Eyes */}
                    <circle cx="-1" cy="-2.5" r="1.5" fill="#FFD700" className="animate-pulse" />
                    <circle cx="-1" cy="2.5" r="1.5" fill="#FFD700" className="animate-pulse" />
                  </g>

                  {/* Tapered Tail Highlight */}
                  <circle cx={conn.to.x} cy={conn.to.y} r={isMobile ? "2" : "3"} fill="#0a2d0a" />
                </g>
              );
            }
          })}
        </svg>

        <div className="flex flex-col relative z-20" style={{ gap: GAP, padding: PADDING }}>
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-row" style={{ gap: GAP }}>
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
                } else {
                  squareClass += " bg-white/10";
                }

                return (
                  <div
                    key={square.id}
                    className={`relative flex flex-col items-center justify-center ${squareClass}`}
                    style={{
                      borderRadius: '4px 12px 6px 10px',
                      width: SQUARE_SIZE,
                      height: SQUARE_SIZE
                    }}
                  >
                    <span className="absolute top-1 left-1.5 text-[10px] font-black text-medieval-ink/40 font-medieval italic">
                      {square.id}
                    </span>

                    {icon && <div className="z-10">{icon}</div>}

                    {isCurrent && (
                      <motion.div
                        layoutId="player"
                        className="absolute inset-0 flex items-center justify-center z-40"
                        initial={{ scale: 0, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <div className="relative flex items-center justify-center" style={{ width: SQUARE_SIZE, height: SQUARE_SIZE }}>
                          <div className="rounded-full border-4 border-medieval-gold shadow-[0_0_20px_rgba(212,175,55,0.6)] overflow-hidden bg-medieval-stone z-10"
                            style={{ width: SQUARE_SIZE * 0.8, height: SQUARE_SIZE * 0.8 }}>
                            <img
                              src={`/${characterId.toLowerCase()}_avatar.png`}
                              alt={characterId}
                              className="w-full h-full object-cover"
                            />
                          </div>
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
