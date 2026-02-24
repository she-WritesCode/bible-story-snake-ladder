import React, { useState, useEffect, useMemo } from "react";
import { Board } from "./components/Board";
import { Dice } from "./components/Dice";
import { CardModal } from "./components/CardModal";
import { StatsPanel } from "./components/StatsPanel";
import { CharacterSelection } from "./components/CharacterSelection";
import {
  generateBoard,
  Square,
  EpochType,
  Card,
  Story,
} from "./gameData";
import { STORIES } from "./data/stories";

import { CHARACTERS } from "./data/characters";
import { motion, AnimatePresence } from "motion/react";
import { Crown, RefreshCw } from "lucide-react";

export default function App() {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [currentSquare, setCurrentSquare] = useState<number>(1);
  const [stats, setStats] = useState({ faith: 10, mercy: 10, courage: 10, favored: 0, spirituality: 0 });
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);

  // Load Active Story
  const activeStory = useMemo(() => {
    if (!selectedCharacterId) return STORIES.DAVID;
    return STORIES[selectedCharacterId] || STORIES.DAVID;
  }, [selectedCharacterId]);

  const activeBoard = useMemo(() => generateBoard(activeStory), [activeStory]);
  const activeCards = activeStory.cards;
  const epochsList = useMemo(() => activeStory.epochs.map(e => e.id), [activeStory]);
  const currentEpochId = useMemo(() => {
    const square = activeBoard.find(s => s.id === currentSquare);
    return square?.epoch || epochsList[0];
  }, [currentSquare, activeBoard, epochsList]);

  const [focusedEpochIndex, setFocusedEpochIndex] = useState(0);

  // Sync focused epoch with current player position
  useEffect(() => {
    const epochIndex = epochsList.indexOf(currentEpochId);
    if (epochIndex !== -1) {
      setFocusedEpochIndex(epochIndex);
    }
  }, [currentEpochId, epochsList]);

  // Handle Character Selection
  const handleCharacterSelect = (characterId: string) => {
    const character = CHARACTERS[characterId];
    setSelectedCharacterId(characterId);
    setStats({
      faith: character.startingStats.faith,
      mercy: 10, // Default mercy
      courage: character.startingStats.courage,
      favored: character.startingStats.favored || 0,
      spirituality: character.startingStats.spirituality || 0,
    });
    setFocusedEpochIndex(0);
  };

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
    }, 1000);
  };

  const checkSquare = (squareId: number) => {
    const square = activeBoard.find((s) => s.id === squareId);
    if (!square) return;

    if (square.type === "FINISH") {
      setGameOver(true);
      return;
    }

    if (["GATE", "SNAKE", "LADDER"].includes(square.type)) {
      let cardType: "WISDOM" | "TEMPTATION" | "PROVIDENCE" = "WISDOM";
      if (square.type === "SNAKE") cardType = "TEMPTATION";
      if (square.type === "LADDER") cardType = "PROVIDENCE";

      const filteredCards = activeCards.filter((c) => c.type === cardType);
      const randomCard = filteredCards[Math.floor(Math.random() * filteredCards.length)];
      if (randomCard) {
        setActiveCard(randomCard);
        setIsModalOpen(true);
      }

      // If it's a fixed ladder with a target
      if (square.type === "LADDER" && square.target) {
        setTimeout(() => {
          setCurrentSquare(square.target!);
          showMessage(square.actionDescription || "You found a ladder!");
        }, 3000);
      }
    }
  };

  const handleCardAnswer = (correct: boolean) => {
    if (!activeCard) return;

    if (activeCard.type === "WISDOM") {
      if (correct) {
        showMessage("Correct! You may proceed.");
        setStats((prev) => ({ ...prev, faith: prev.faith + 5 }));
      } else {
        showMessage("Incorrect. Stay here and try again next turn.");
        setStats((prev) => ({ ...prev, faith: Math.max(0, prev.faith - 2) }));
        const square = activeBoard.find((s) => s.id === currentSquare);
        if (square?.type === "GATE") {
          setTimeout(() => setCurrentSquare(Math.max(1, currentSquare - 1)), 2000);
        }
      }
    } else if (activeCard.type === "TEMPTATION") {
      if (correct) {
        showMessage("You overcame the temptation!");
        setStats((prev) => ({ ...prev, courage: prev.courage + 5 }));
        if (activeCard.successEffect?.move) {
          setTimeout(() => setCurrentSquare(Math.min(100, currentSquare + activeCard.successEffect!.move!)), 2000);
        }
      } else {
        showMessage("You fell to the temptation.");
        setStats((prev) => ({ ...prev, courage: Math.max(0, prev.courage - 5) }));
        if (activeCard.failureEffect?.move) {
          setTimeout(() => setCurrentSquare(Math.max(1, currentSquare + activeCard.failureEffect!.move!)), 2000);
        }
      }
    } else if (activeCard.type === "PROVIDENCE") {
      showMessage("A blessing from the Lord!");
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
    const character = selectedCharacterId ? CHARACTERS[selectedCharacterId] : CHARACTERS.DAVID;
    setStats({
      faith: character.startingStats.faith,
      mercy: 10,
      courage: character.startingStats.courage,
      favored: character.startingStats.favored || 0,
      spirituality: character.startingStats.spirituality || 0,
    });
    setGameOver(false);
    setMessage(null);
    setFocusedEpochIndex(0);
  };

  const returnToMenu = () => {
    setSelectedCharacterId(null);
    resetGame();
  };

  if (!selectedCharacterId) {
    return <CharacterSelection onSelect={handleCharacterSelect} />;
  }

  const focusedEpoch = activeStory.epochs[focusedEpochIndex];

  return (
    <div className="h-screen overflow-hidden flex flex-col relative bg-medieval-stone shadow-inner">
      <header className="w-full flex justify-center py-4 px-4 shrink-0 z-10">
        <div className="w-full max-w-4xl medieval-scroll p-4 text-center border-y-2 border-medieval-gold/30 shadow-xl bg-medieval-parchment/90 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="text-left">
              <h1 className="text-xl md:text-3xl font-display font-black text-medieval-blood tracking-widest uppercase">
                {activeStory.name}
              </h1>
              <p className="text-medieval-stone font-medieval text-xs italic">
                {focusedEpoch?.name}
              </p>
            </div>

            <div className="flex gap-4 items-center">
              <div className="hidden md:flex flex-col items-center px-4 py-1 bg-medieval-stone/5 border border-medieval-stone/10 rounded-sm">
                <span className="text-[10px] font-black text-medieval-stone uppercase tracking-tighter">Current Epoch</span>
                <span className="font-serif text-medieval-ink font-bold">
                  {activeStory.epochs.find(e => e.id === currentEpochId)?.name}
                </span>
              </div>
              <button
                onClick={returnToMenu}
                className="p-2 bg-medieval-stone/10 border border-medieval-stone/20 rounded-full hover:bg-medieval-blood hover:text-white transition-colors"
                title="Change Hero"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="grow relative flex flex-col items-center justify-start p-4 md:p-8 overflow-hidden">
        <div className="w-full max-w-7xl h-full flex flex-col items-center gap-4 relative">
          <Board
            squares={activeBoard}
            currentSquare={currentSquare}
            focusedEpochIndex={focusedEpochIndex}
            onPan={(direction) => setFocusedEpochIndex(prev => Math.max(0, Math.min(epochsList.length - 1, prev + direction)))}
            maxUnlockedEpochIndex={epochsList.indexOf(currentEpochId)}
            characterId={selectedCharacterId}
            epochs={activeStory.epochs}
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
        characterId={selectedCharacterId}
      />

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
                {activeStory.characterId === "ESTHER"
                  ? '"Thou hast saved thy people through courage and favor!"'
                  : '"Thou hast walked with the Lord through every trial. A crown of life awaits thee!"'}
              </p>

              <div className="grid grid-cols-3 gap-4 md:gap-8 mb-12">
                <StatResult label="Faith" value={stats.faith} />
                <StatResult label="Mercy" value={stats.mercy} />
                <StatResult label="Courage" value={stats.courage} />
              </div>

              <button onClick={returnToMenu} className="medieval-button w-full py-5 text-xl">
                Begin Another Chronicle
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const StatResult: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex flex-col p-2 md:p-4 bg-medieval-ink/5 rounded-sm border border-medieval-stone/10 font-serif">
    <span className="text-[10px] uppercase font-display text-medieval-stone tracking-widest mb-1">{label}</span>
    <span className="text-2xl md:text-4xl font-black text-medieval-blood">{value}</span>
  </div>
);
