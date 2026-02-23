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
    <div className="flex flex-row gap-4 sm:gap-8 bg-white p-4 rounded-2xl shadow-md border border-gray-100 w-full max-w-md justify-center">
      <div className="flex flex-col items-center gap-1">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <Zap className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Faith
        </span>
        <span className="text-xl font-black text-gray-800">{stats.faith}</span>
      </div>

      <div className="w-px bg-gray-200 h-16 self-center"></div>

      <div className="flex flex-col items-center gap-1">
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
          <Heart className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Mercy
        </span>
        <span className="text-xl font-black text-gray-800">{stats.mercy}</span>
      </div>

      <div className="w-px bg-gray-200 h-16 self-center"></div>

      <div className="flex flex-col items-center gap-1">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
          <Shield className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Courage
        </span>
        <span className="text-xl font-black text-gray-800">
          {stats.courage}
        </span>
      </div>
    </div>
  );
};
