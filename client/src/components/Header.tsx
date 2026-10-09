import React from "react";
import { Sparkles, History, Building2 } from "lucide-react";

interface HeaderProps {
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHistory, historyCount }) => {
  return (
    <header className="border-b border-white/10 bg-[#0e131f]/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-wadii-500 to-amber-600 flex items-center justify-center shadow-lg shadow-wadii-600/30 ring-1 ring-white/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                Wadii <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-wadii-500/20 text-wadii-400 border border-wadii-500/30">AI Intake</span>
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                v1.0 Live
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Intelligent WhatsApp Lead Parser for Indian Banquets & Event Venues
            </p>
          </div>
        </div>

        {/* Action Controls & Badges */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>OpenAI GPT-4o Engine</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Server Key Protected</span>
          </div>

          <button
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 px-3 py-1.5 rounded-lg transition-all shadow-sm"
            title="View recent lead analyses"
          >
            <History className="w-3.5 h-3.5 text-wadii-400" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="ml-1 bg-wadii-600/30 text-wadii-300 border border-wadii-500/40 text-[10px] px-1.5 py-0.2 rounded-full font-semibold">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
