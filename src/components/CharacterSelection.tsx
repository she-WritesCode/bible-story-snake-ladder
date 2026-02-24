import React from "react";
import { CHARACTERS, Character } from "../data/characters";
import { motion, AnimatePresence } from "motion/react";
import { Crown, BookOpen, Shield, Heart } from "lucide-react";

interface CharacterSelectionProps {
  onSelect: (characterId: string) => void;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto pt-20">
      <div className="w-full max-w-6xl">
        <header className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-display font-black text-medieval-gold tracking-[0.2em] uppercase mb-4">
            Select Thy Hero
          </h2>
          <p className="text-medieval-parchment font-medieval text-lg italic tracking-widest max-w-2xl mx-auto">
            Choose a soul to guide through the chronicles of faith. Each hero brings unique divine favor to the journey.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.values(CHARACTERS).map((char) => (
            <CharacterCard key={char.id} character={char} onSelect={() => onSelect(char.id)} />
          ))}
        </div>
      </div>
    </div>
  );
};

const CharacterCard: React.FC<{ character: Character; onSelect: () => void }> = ({
  character,
  onSelect,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className="medieval-scroll cursor-pointer group flex flex-col items-center p-6 border-2 border-medieval-gold/30 hover:border-medieval-gold transition-all duration-300"
    >
      <div className="w-24 h-24 bg-medieval-stone rounded-full overflow-hidden border-4 border-medieval-gold mb-6 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all">
        <img
          src={`/${character.id.toLowerCase()}_avatar.png`}
          alt={character.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        />
      </div>

      <h3 className="text-2xl font-display font-black text-medieval-blood mb-2 uppercase tracking-wider text-center">
        {character.name.split(" ")[0]}
      </h3>
      <p className="text-xs font-medieval text-medieval-stone italic mb-6 text-center h-12">
        {character.abilities.description}
      </p>

      <div className="w-full space-y-3">
        <StatRow label="Faith" value={character.startingStats.faith} color="text-medieval-blood" />
        <StatRow label="Wisdom" value={character.startingStats.wisdom} color="text-medieval-ink" />
        <StatRow label="Courage" value={character.startingStats.courage} color="text-medieval-stone" />
      </div>

      <button className="medieval-button w-full mt-8 py-2 text-sm">
        Begin Chronicle
      </button>
    </motion.div>
  );
};

const StatRow: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="flex items-center justify-between border-b border-medieval-stone/10 pb-1">
    <span className="text-[10px] uppercase font-display text-medieval-stone tracking-widest">{label}</span>
    <span className={`text-sm font-black ${color}`}>{value}</span>
  </div>
);
