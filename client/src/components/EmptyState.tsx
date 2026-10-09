import React from "react";
import { MessageSquareText, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { DEMO_SAMPLES } from "../constants/samples";
import { DemoSample } from "../types/lead";

interface EmptyStateProps {
  onSelectSample: (sample: DemoSample) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectSample }) => {
  return (
    <div className="bg-[#111827]/70 rounded-2xl border border-dashed border-white/15 p-8 text-center space-y-6 backdrop-blur-md">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-wadii-500/20 to-amber-500/20 border border-wadii-500/30 flex items-center justify-center text-wadii-400">
        <MessageSquareText className="w-7 h-7" />
      </div>

      <div className="max-w-md mx-auto space-y-2">
        <h3 className="text-lg font-bold text-white font-sans">
          Ready to Turn Inquiries into Structured Leads
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Indian banquet managers spend hours deciphering messy WhatsApp messages.
          Paste an inquiry on the left or click any demo sample below to test AI extraction.
        </p>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto pt-2 text-left">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-wadii-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Honest Extraction</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Never invents dates or prices. Null values kept for missing details.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Smart Follow-ups</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Generates 2–6 missing questions a manager needs to qualify the booking.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>WhatsApp Reply</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Ready-to-paste courteous reply without fake booking commitments.
          </p>
        </div>
      </div>

      {/* Quick Launch Buttons */}
      <div className="pt-2 border-t border-white/5 max-w-lg mx-auto">
        <p className="text-[11px] text-slate-400 mb-2 font-medium">
          Quick start with realistic demo scenarios:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {DEMO_SAMPLES.slice(0, 3).map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <span>{sample.title}</span>
              <ArrowRight className="w-3 h-3 text-wadii-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
