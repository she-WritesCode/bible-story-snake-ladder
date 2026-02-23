import React from "react";
import { Shield, Sparkles, Sword } from "lucide-react";

interface StatsPanelProps {
  stats: {
    faith: number;
    mercy: number;
    courage: number;
  };
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  return (
    <div className="flex flex-row gap-6 sm:gap-12 bg-medieval-parchment/90 p-6 rounded-sm shadow-2xl border-4 border-medieval-stone w-full max-w-xl justify-center relative backdrop-blur-sm">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] pointer-events-none"></div>

      <div className="flex flex-col items-center gap-2 group">
        <div className="w-12 h-12 rounded-b-full bg-blue-900 flex items-center justify-center text-medieval-parchment border-2 border-medieval-gold shadow-lg group-hover:scale-110 transition-transform">
          <Sparkles className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-black text-medieval-stone uppercase tracking-widest font-display">
          Faith
        </span>
        <span className="text-2xl font-black text-medieval-ink font-serif">
          {stats.faith}
        </span>
      </div>

      <div className="w-px bg-medieval-stone/30 h-12 self-end mb-2"></div>

      <div className="flex flex-col items-center gap-2 group">
        <div className="w-12 h-12 rounded-b-full bg-medieval-blood flex items-center justify-center text-medieval-parchment border-2 border-medieval-gold shadow-lg group-hover:scale-110 transition-transform">
          <Shield className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-black text-medieval-stone uppercase tracking-widest font-display">
          Mercy
        </span>
        <span className="text-2xl font-black text-medieval-ink font-serif">
          {stats.mercy}
        </span>
      </div>

      <div className="w-px bg-medieval-stone/30 h-12 self-end mb-2"></div>

      <div className="flex flex-col items-center gap-2 group">
        <div className="w-12 h-12 rounded-b-full bg-medieval-gold flex items-center justify-center text-medieval-blood border-2 border-medieval-stone shadow-lg group-hover:scale-110 transition-transform">
          <Sword className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-black text-medieval-stone uppercase tracking-widest font-display">
          Courage
        </span>
        <span className="text-2xl font-black text-medieval-ink font-serif">
          {stats.courage}
        </span>
      </div>
    </div>
  );
};
