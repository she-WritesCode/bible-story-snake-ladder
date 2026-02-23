import React from "react";
import { Heart, Shield, Zap } from "lucide-react";

interface StatsPanelProps {
  stats: {
    faith: number;
    mercy: number;
    courage: number;
  };
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  return (
    <div className="flex flex-row gap-4 sm:gap-8 bg-[#e8dcc7] p-4 rounded-2xl shadow-xl border-4 border-[#5c4033] w-full max-w-md justify-center">
      <div className="flex flex-col items-center gap-1">
        <div className="w-10 h-10 rounded-full bg-[#4682b4] flex items-center justify-center text-[#e8dcc7] border-2 border-[#1a364d]">
          <Zap className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold text-[#8b5a2b] uppercase tracking-wider font-serif">
          Faith
        </span>
        <span className="text-xl font-black text-[#3e2723] font-serif">
          {stats.faith}
        </span>
      </div>

      <div className="w-px bg-[#8b5a2b] h-16 self-center opacity-50"></div>

      <div className="flex flex-col items-center gap-1">
        <div className="w-10 h-10 rounded-full bg-[#8b0000] flex items-center justify-center text-[#e8dcc7] border-2 border-[#3e2723]">
          <Heart className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold text-[#8b5a2b] uppercase tracking-wider font-serif">
          Mercy
        </span>
        <span className="text-xl font-black text-[#3e2723] font-serif">
          {stats.mercy}
        </span>
      </div>

      <div className="w-px bg-[#8b5a2b] h-16 self-center opacity-50"></div>

      <div className="flex flex-col items-center gap-1">
        <div className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center text-[#5c4033] border-2 border-[#8b5a2b]">
          <Shield className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold text-[#8b5a2b] uppercase tracking-wider font-serif">
          Courage
        </span>
        <span className="text-xl font-black text-[#3e2723] font-serif">
          {stats.courage}
        </span>
      </div>
    </div>
  );
};
