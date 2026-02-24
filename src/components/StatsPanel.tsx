import React from "react";
import { Shield, Sparkles, Sword, Heart, Eye } from "lucide-react";

interface StatsPanelProps {
  stats: {
    faith: number;
    mercy: number;
    courage: number;
    favored?: number;
    spirituality?: number;
  };
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  return (
    <div className="flex flex-row flex-wrap gap-4 sm:gap-8 bg-medieval-parchment/90 p-4 md:p-6 rounded-sm shadow-2xl border-4 border-medieval-stone w-full max-w-xl justify-center relative backdrop-blur-sm">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] pointer-events-none"></div>

      <StatBox icon={<Sparkles className="w-6 h-6" />} label="Faith" value={stats.faith} color="bg-blue-900" />
      <Divider />
      <StatBox icon={<Shield className="w-6 h-6" />} label="Mercy" value={stats.mercy} color="bg-medieval-blood" />
      <Divider />
      <StatBox icon={<Sword className="w-6 h-6" />} label="Courage" value={stats.courage} color="bg-medieval-gold" iconColor="text-medieval-blood" />

      {stats.favored !== undefined && stats.favored > 0 && (
        <>
          <Divider />
          <StatBox icon={<Heart className="w-6 h-6" />} label="Favor" value={stats.favored} color="bg-pink-700" />
        </>
      )}

      {stats.spirituality !== undefined && stats.spirituality > 0 && (
        <>
          <Divider />
          <StatBox icon={<Eye className="w-6 h-6" />} label="Spirit" value={stats.spirituality} color="bg-indigo-900" />
        </>
      )}
    </div>
  );
};

const StatBox: React.FC<{ icon: React.ReactNode; label: string; value: number; color: string; iconColor?: string }> = ({
  icon, label, value, color, iconColor = "text-medieval-parchment"
}) => (
  <div className="flex flex-col items-center gap-1 group min-w-[60px]">
    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-b-full ${color} flex items-center justify-center ${iconColor} border-2 border-medieval-gold shadow-lg group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <span className="text-[8px] md:text-[10px] font-black text-medieval-stone uppercase tracking-widest font-display">
      {label}
    </span>
    <span className="text-xl md:text-2xl font-black text-medieval-ink font-serif">
      {value}
    </span>
  </div>
);

const Divider = () => <div className="hidden sm:block w-px bg-medieval-stone/30 h-10 self-end mb-2"></div>;
