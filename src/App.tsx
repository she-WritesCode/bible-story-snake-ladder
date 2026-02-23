import React, { useState, useEffect } from "react";
import { Board } from "./components/Board";
import { Dice } from "./components/Dice";
import { CardModal } from "./components/CardModal";
import { StatsPanel } from "./components/StatsPanel";
import {
  GAME_BOARD,
  CARDS,
  Card,
  Square,
  EpochType,
  getEpochForSquare,
  EPOCHS,
} from "./gameData";
import { motion, AnimatePresence } from "motion/react";
import { Crown, Trophy, RefreshCw } from "lucide-react";

export default function App() {
  const [currentSquare, setCurrentSquare] = useState<number>(1);
  const [stats, setStats] = useState({ faith: 10, mercy: 10, courage: 10 });
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);

  // Epoch State
  const epochsList: EpochType[] = Object.keys(EPOCHS) as EpochType[];
  const currentEpoch = getEpochForSquare(currentSquare);
  const [focusedEpochIndex, setFocusedEpochIndex] = useState(epochsList.indexOf(currentEpoch));

  // Auto-focus when David moves
  useEffect(() => {
    setFocusedEpochIndex(epochsList.indexOf(currentEpoch));
  }, [currentSquare]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 4000);
  };

  const handleRoll = (value: number) => {
    setIsRolling(true);
    let nextSquare = currentSquare + value;
    if (nextSquare > 100) nextSquare = 100;

    setTimeout(() => {
      setCurrentSquare(nextSquare);
      setIsRolling(false);
      checkSquare(nextSquare);
    }, 1000);
  };

  const checkSquare = (squareId: number) => {
    const square = GAME_BOARD.find((s) => s.id === squareId);
    if (!square) return;

    if (square.type === "FINISH") {
      setGameOver(true);
      return;
    }

    if (square.type === "GATE") {
      const wisdomCards = CARDS.filter((c) => c.type === "WISDOM");
      const randomCard = wisdomCards[Math.floor(Math.random() * wisdomCards.length)];
      setActiveCard(randomCard);
      setIsModalOpen(true);
    } else if (square.type === "SNAKE") {
      const temptationCards = CARDS.filter((c) => c.type === "TEMPTATION");
      const randomCard = temptationCards[Math.floor(Math.random() * temptationCards.length)];
      setActiveCard(randomCard);
      setIsModalOpen(true);
    } else if (square.type === "LADDER") {
      const providenceCards = CARDS.filter((c) => c.type === "PROVIDENCE");
      const randomCard = providenceCards[Math.floor(Math.random() * providenceCards.length)];
      setActiveCard(randomCard);
      setIsModalOpen(true);

      if (square.target) {
        setTimeout(() => {
          setCurrentSquare(square.target!);
          showMessage(square.actionDescription || "A divine path opens before thee!");
        }, 3000);
      }
    }
  };

  const handleCardAnswer = (correct: boolean) => {
    if (!activeCard) return;

    if (correct) {
      if (activeCard.type === "WISDOM") {
        showMessage("Thy wisdom shines! Advance with faith.");
        setStats((prev) => ({ ...prev, faith: prev.faith + 5 }));
      } else if (activeCard.type === "TEMPTATION") {
        showMessage("Temptation overcome! Thy spirit grows strong.");
        setStats((prev) => ({ ...prev, courage: prev.courage + 5 }));
        if (activeCard.successEffect?.move) {
          setTimeout(() => setCurrentSquare(Math.min(100, currentSquare + activeCard.successEffect!.move!)), 2000);
        }
      }
    } else {
      if (activeCard.type === "WISDOM") {
        showMessage("The scroll remains sealed. Reflect on thy path.");
        setStats((prev) => ({ ...prev, faith: Math.max(0, prev.faith - 2) }));
        if (currentSquare % 10 === 0) { // If at a gate
          setTimeout(() => setCurrentSquare(Math.max(1, currentSquare - 1)), 2000);
        }
      } else if (activeCard.type === "TEMPTATION") {
        showMessage("The trap has sprung! Thy courage falters.");
        setStats((prev) => ({ ...prev, courage: Math.max(0, prev.courage - 5) }));
        if (activeCard.failureEffect?.move) {
          setTimeout(() => setCurrentSquare(Math.max(1, currentSquare + activeCard.failureEffect!.move!)), 2000);
        }
      }
    }

    if (activeCard.type === "PROVIDENCE") {
      showMessage("Divine favor is upon thee!");
      setStats((prev) => ({ ...prev, mercy: prev.mercy + 5 }));
      if (activeCard.effect?.move) {
        setTimeout(() => setCurrentSquare(Math.min(100, currentSquare + activeCard.effect!.move!)), 2000);
      }
    }

    setIsModalOpen(false);
    setActiveCard(null);
  };

  const resetGame = () => {
    setCurrentSquare(1);
    setStats({ faith: 10, mercy: 10, courage: 10 });
    setGameOver(false);
    setMessage(null);
    setFocusedEpochIndex(0);
  };

  const focusedEpoch = epochsList[focusedEpochIndex];

  return (
    <div className="h-screen overflow-hidden flex flex-col relative bg-medieval-stone shadow-inner">
      {/* Scroll Header - Fixed height */}
      <header className="w-full flex justify-center py-4 px-4 shrink-0 z-10">
        <div className="w-full max-w-4xl medieval-scroll p-4 text-center border-y-2 border-medieval-gold/30 shadow-xl bg-medieval-parchment/90 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="text-left">
              <h1 className="text-xl md:text-3xl font-display font-black text-medieval-blood tracking-widest uppercase">
                David's Journey
              </h1>
              <p className="text-medieval-stone font-medieval text-xs italic">
                {EPOCHS[focusedEpoch].name}
              </p>
            </div>

            <div className="flex gap-4 items-center">
              <div className="hidden md:flex flex-col items-center px-4 py-1 bg-medieval-stone/5 border border-medieval-stone/10 rounded-sm">
                <span className="text-[10px] font-black text-medieval-stone uppercase tracking-tighter">David's Epoch</span>
                <span className="font-serif text-medieval-ink font-bold">{EPOCHS[currentEpoch].name}</span>
              </div>
              <button
                onClick={resetGame}
                className="p-2 bg-medieval-stone/10 border border-medieval-stone/20 rounded-full hover:bg-medieval-blood hover:text-white transition-colors"
                title="Restart Chronicle"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Expands */}
      <main className="grow relative flex flex-col items-center justify-start p-4 md:p-8 overflow-hidden">
        <div className="w-full max-w-7xl h-full flex flex-col items-center gap-4 relative">
          <Board
            squares={GAME_BOARD}
            currentSquare={currentSquare}
            focusedEpochIndex={focusedEpochIndex}
            onPan={(direction) => setFocusedEpochIndex(prev => Math.max(0, Math.min(epochsList.length - 1, prev + direction)))}
            maxUnlockedEpochIndex={epochsList.indexOf(currentEpoch)}
          />

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-xl text-center p-4 bg-medieval-ink text-medieval-parchment border-2 border-medieval-gold font-medieval italic shadow-2xl z-40"
              >
                "{message}"
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Fixed Bottom Bar */}
      <footer className="w-full h-24 md:h-28 bg-medieval-stone border-t-4 border-medieval-gold shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 p-2 md:p-4 shrink-0">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between gap-4">
          <div className="w-1/4 hidden md:block">
            <div className="medieval-scroll p-3 flex flex-col items-center bg-opacity-50">
              <span className="text-[10px] font-black text-medieval-stone uppercase tracking-widest font-display">Path Taken</span>
              <div className="text-2xl font-black font-serif text-medieval-ink">
                {currentSquare} <span className="text-[10px] text-medieval-stone/60 font-medieval italic">/ 100</span>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-xl">
            <StatsPanel stats={stats} />
          </div>

          <div className="w-1/4 flex justify-end">
            <Dice onRoll={handleRoll} disabled={isRolling || isModalOpen || !!message || gameOver} />
          </div>
        </div>
      </footer>

      <CardModal
        card={activeCard}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAnswer={handleCardAnswer}
      />

      {/* Victory Scroll Modal */}
      <AnimatePresence>
        {gameOver && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-3xl w-full p-12 md:p-20 medieval-scroll text-center border-medieval-gold shadow-[0_0_100px_rgba(212,175,55,0.4)]"
            >
              <div className="mb-8 flex justify-center">
                <div className="w-32 h-32 bg-medieval-gold rounded-full flex items-center justify-center border-8 border-medieval-stone shadow-2xl">
                  <Crown className="w-16 h-16 text-medieval-blood" />
                </div>
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-black text-medieval-blood mb-4 tracking-widest uppercase">Victory</h2>
              <p className="text-xl md:text-3xl font-serif text-medieval-ink mb-12 italic">
                "Thou hast walked with the Lord through every trial. A crown of life awaits thee!"
              </p>

              <div className="grid grid-cols-3 gap-4 md:gap-8 mb-12">
                <div className="flex flex-col p-2 md:p-4 bg-medieval-ink/5 rounded-sm border border-medieval-stone/10 font-serif">
                  <span className="text-[10px] uppercase font-display text-medieval-stone tracking-widest mb-1">Faith</span>
                  <span className="text-2xl md:text-4xl font-black text-medieval-blood">{stats.faith}</span>
                </div>
                <div className="flex flex-col p-2 md:p-4 bg-medieval-ink/5 rounded-sm border border-medieval-stone/10 font-serif">
                  <span className="text-[10px] uppercase font-display text-medieval-stone tracking-widest mb-1">Mercy</span>
                  <span className="text-2xl md:text-4xl font-black text-medieval-blood">{stats.mercy}</span>
                </div>
                <div className="flex flex-col p-2 md:p-4 bg-medieval-ink/5 rounded-sm border border-medieval-stone/10 font-serif">
                  <span className="text-[10px] uppercase font-display text-medieval-stone tracking-widest mb-1">Courage</span>
                  <span className="text-2xl md:text-4xl font-black text-medieval-blood">{stats.courage}</span>
                </div>
              </div>

              <button onClick={resetGame} className="medieval-button w-full py-5 text-xl">
                Begin Thy Reign
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
