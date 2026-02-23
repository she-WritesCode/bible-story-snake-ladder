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

  const currentEpoch = getEpochForSquare(currentSquare);
  const epochInfo = EPOCHS[currentEpoch];

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRoll = (value: number) => {
    setIsRolling(true);
    let nextSquare = currentSquare + value;
    if (nextSquare > 100) nextSquare = 100;

    setTimeout(() => {
      setCurrentSquare(nextSquare);
      setIsRolling(false);
      checkSquare(nextSquare);
    }, 1000); // Wait for dice animation
  };

  const checkSquare = (squareId: number) => {
    const square = GAME_BOARD.find((s) => s.id === squareId);
    if (!square) return;

    if (square.type === "FINISH") {
      setGameOver(true);
      return;
    }

    if (square.type === "GATE") {
      // Draw a Wisdom card
      const wisdomCards = CARDS.filter((c) => c.type === "WISDOM");
      const randomCard =
        wisdomCards[Math.floor(Math.random() * wisdomCards.length)];
      setActiveCard(randomCard);
      setIsModalOpen(true);
    } else if (square.type === "SNAKE") {
      // Draw a Temptation card or apply penalty
      const temptationCards = CARDS.filter((c) => c.type === "TEMPTATION");
      const randomCard =
        temptationCards[Math.floor(Math.random() * temptationCards.length)];
      setActiveCard(randomCard);
      setIsModalOpen(true);
    } else if (square.type === "LADDER") {
      // Draw a Providence card or apply bonus
      const providenceCards = CARDS.filter((c) => c.type === "PROVIDENCE");
      const randomCard =
        providenceCards[Math.floor(Math.random() * providenceCards.length)];
      setActiveCard(randomCard);
      setIsModalOpen(true);

      if (square.target) {
        setTimeout(() => {
          setCurrentSquare(square.target!);
          showMessage(square.actionDescription || "You found a ladder!");
        }, 3000);
      }
    }
  };

  const handleCardAnswer = (correct: boolean) => {
    if (activeCard?.type === "WISDOM") {
      if (correct) {
        showMessage("Correct! You may proceed.");
        setStats((prev) => ({ ...prev, faith: prev.faith + 5 }));
      } else {
        showMessage("Incorrect. Stay here and try again next turn.");
        setStats((prev) => ({ ...prev, faith: Math.max(0, prev.faith - 2) }));
        // If at a gate, maybe move back 1 space?
        const square = GAME_BOARD.find((s) => s.id === currentSquare);
        if (square?.type === "GATE") {
          setTimeout(
            () => setCurrentSquare(Math.max(1, currentSquare - 1)),
            2000,
          );
        }
      }
    } else if (activeCard?.type === "TEMPTATION") {
      if (correct) {
        showMessage("You overcame the temptation!");
        setStats((prev) => ({ ...prev, courage: prev.courage + 5 }));
        if (activeCard.successEffect?.move) {
          setTimeout(
            () =>
              setCurrentSquare(
                Math.min(100, currentSquare + activeCard.successEffect!.move!),
              ),
            2000,
          );
        }
      } else {
        showMessage("You fell to the temptation.");
        setStats((prev) => ({
          ...prev,
          courage: Math.max(0, prev.courage - 5),
        }));
        if (activeCard.failureEffect?.move) {
          setTimeout(
            () =>
              setCurrentSquare(
                Math.max(1, currentSquare + activeCard.failureEffect!.move!),
              ),
            2000,
          );
        }
      }
    } else if (activeCard?.type === "PROVIDENCE") {
      showMessage("A blessing from the Lord!");
      setStats((prev) => ({ ...prev, mercy: prev.mercy + 5 }));
      if (activeCard.effect?.move) {
        setTimeout(
          () =>
            setCurrentSquare(
              Math.min(100, currentSquare + activeCard.effect!.move!),
            ),
          2000,
        );
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
  };

  return (
    <div
      className="min-h-screen bg-[#f5f2ed] font-sans text-gray-900 flex flex-col items-center py-8 px-4 select-none"
      onCopy={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
    >
      {/* Header */}
      <header className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Crown className="w-8 h-8 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 font-serif">
              David's Journey
            </h1>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
              The Epic Board Game
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`px-4 py-2 rounded-full font-bold text-sm shadow-sm border-2 ${epochInfo.bgClass} border-gray-200`}
          >
            Epoch: {epochInfo.name}
          </div>
          <button
            onClick={resetGame}
            className="p-2 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl flex flex-col gap-8 items-center">
        {/* Top: Board */}
        <div className="w-full flex flex-col gap-6">
          <Board squares={GAME_BOARD} currentSquare={currentSquare} />

          {/* Message Toast */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl font-semibold z-50"
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom: Controls & Stats */}
        <div className="w-full flex flex-col md:flex-row gap-8 items-center md:items-stretch justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-full md:w-1/3 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Your Turn</h2>
            <Dice
              onRoll={handleRoll}
              disabled={isRolling || isModalOpen || gameOver}
            />
          </div>

          <div className="w-full md:w-1/3 flex items-center justify-center">
            <StatsPanel stats={stats} />
          </div>

          {/* Current Square Info */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-full md:w-1/3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
              Current Location
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {currentSquare}
              </div>
              <p className="font-semibold text-lg text-gray-800">
                {GAME_BOARD.find((s) => s.id === currentSquare)?.label ||
                  `Square ${currentSquare}`}
              </p>
            </div>
            {GAME_BOARD.find((s) => s.id === currentSquare)
              ?.actionDescription && (
              <p className="mt-4 text-sm text-gray-600 italic border-l-4 border-indigo-200 pl-3">
                "
                {
                  GAME_BOARD.find((s) => s.id === currentSquare)
                    ?.actionDescription
                }
                "
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <CardModal
        card={activeCard}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAnswer={handleCardAnswer}
      />

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameOver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center flex flex-col items-center"
            >
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <Trophy className="w-12 h-12 text-yellow-500" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4 font-serif">
                A Man After God's Heart
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                You have completed David's journey! Through faith, mercy, and
                courage, you navigated the trials and triumphs of his life.
              </p>

              <div className="flex gap-4 mb-8 w-full justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.faith}
                  </div>
                  <div className="text-xs uppercase font-bold text-gray-500">
                    Faith
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">
                    {stats.mercy}
                  </div>
                  <div className="text-xs uppercase font-bold text-gray-500">
                    Mercy
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {stats.courage}
                  </div>
                  <div className="text-xs uppercase font-bold text-gray-500">
                    Courage
                  </div>
                </div>
              </div>

              <button
                onClick={resetGame}
                className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-xl w-full"
              >
                Play Again
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
