import React from "react";
import { DEMO_SAMPLES } from "../constants/samples";
import { DemoSample } from "../types/lead";
import { Sparkles, Calendar, Zap, HelpCircle, MessageSquare, GlassWater } from "lucide-react";

interface SampleSelectorProps {
  onSelectSample: (sample: DemoSample) => void;
  selectedSampleId: string | null;
  disabled?: boolean;
}

export const SampleSelector: React.FC<SampleSelectorProps> = ({
  onSelectSample,
  selectedSampleId,
  disabled = false,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case "sample-a":
        return <Calendar className="w-4 h-4 text-rose-400" />;
      case "sample-b":
        return <Zap className="w-4 h-4 text-red-400" />;
      case "sample-c":
        return <HelpCircle className="w-4 h-4 text-amber-400" />;
      case "sample-d":
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case "sample-e":
        return <GlassWater className="w-4 h-4 text-purple-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-wadii-400" />;
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>One-Click Realistic Inquiries</span>
        </label>
        <span className="text-[11px] text-slate-400 font-normal">
          Click any sample to auto-populate inquiry details
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {DEMO_SAMPLES.map((sample) => {
          const isSelected = selectedSampleId === sample.id;
          return (
            <button
              key={sample.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectSample(sample)}
              className={`p-2.5 rounded-xl text-left border transition-all duration-200 relative group flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-800 border-wadii-500 shadow-md shadow-wadii-900/20 ring-1 ring-wadii-500/50"
                  : "bg-slate-900/60 hover:bg-slate-800/80 border-white/5 hover:border-white/15"
              } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1.5 rounded-lg bg-slate-800/80 border border-white/5">
                    {getIcon(sample.id)}
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium border ${sample.badgeColor} bg-opacity-10 border-opacity-30`}
                  >
                    {sample.id.toUpperCase().replace("SAMPLE-", "SAMPLE ")}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-white group-hover:text-wadii-300 transition-colors">
                  {sample.title.split("—")[1]?.trim() || sample.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {sample.tag}
                </p>
              </div>

              <div className="mt-2 pt-1.5 border-t border-white/5 text-[10px] text-slate-500 flex items-center justify-between">
                <span>{sample.customerName}</span>
                <span className="text-wadii-400/80 font-medium group-hover:translate-x-0.5 transition-transform">
                  Load →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
