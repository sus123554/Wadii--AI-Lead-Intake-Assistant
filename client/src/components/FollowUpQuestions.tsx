import React, { useState } from "react";
import { HelpCircle, Copy, Check, CheckSquare, Square } from "lucide-react";

interface FollowUpQuestionsProps {
  questions: string[];
}

export const FollowUpQuestions: React.FC<FollowUpQuestionsProps> = ({
  questions,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [checkedIndices, setCheckedIndices] = useState<Record<number, boolean>>(
    {}
  );

  const toggleCheck = (index: number) => {
    setCheckedIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleCopyQuestions = () => {
    const formatted = questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#111827]/90 rounded-2xl border border-white/10 p-5 shadow-xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Missing Information Checklist
            </h3>
            <p className="text-xs text-slate-400">
              Key questions to ask the customer to qualify the booking
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyQuestions}
          className="flex items-center space-x-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 px-2.5 py-1.5 rounded-lg transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Questions</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-2">
        {questions.map((question, index) => {
          const isChecked = Boolean(checkedIndices[index]);
          return (
            <div
              key={index}
              onClick={() => toggleCheck(index)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                isChecked
                  ? "bg-slate-900/40 border-emerald-500/30 text-slate-400 line-through opacity-70"
                  : "bg-slate-900/80 hover:bg-slate-850 border-white/5 hover:border-white/15 text-slate-200"
              }`}
            >
              <div className="mt-0.5 shrink-0 text-slate-400">
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 hover:text-wadii-400" />
                )}
              </div>
              <p className="text-xs leading-relaxed font-medium flex-1">
                {question}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
