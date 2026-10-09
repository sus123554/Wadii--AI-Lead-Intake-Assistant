import React from "react";
import { History, X, Clock, ArrowRight, User, Calendar } from "lucide-react";
import { HistoryItem } from "../types/lead";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-wadii-500/10 text-wadii-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Recent Lead Analyses ({history.length})
              </h3>
              <p className="text-[11px] text-slate-400">
                In-memory history buffer (Phase 2 Demo History)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of items */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
              <p>No lead analyses recorded yet in this session.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Analyze an inquiry to see it logged here.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-white/5 hover:border-wadii-500/40 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white capitalize bg-slate-800 px-2 py-0.5 rounded border border-white/5">
                      {item.output.eventType}
                    </span>
                    {item.input.customerName && (
                      <span className="text-slate-300 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {item.input.customerName}
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 font-mono text-[10px]">
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-1">
                  {item.output.summary}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    {item.output.eventDate ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        {item.output.eventDate}
                      </span>
                    ) : (
                      <span className="text-amber-400 italic">Date unfixed</span>
                    )}
                    {item.output.guestCount && (
                      <span>• {item.output.guestCount} pax</span>
                    )}
                  </div>
                  <span className="text-wadii-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[11px]">
                    Load Details <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Buffer capped at 10 items</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
