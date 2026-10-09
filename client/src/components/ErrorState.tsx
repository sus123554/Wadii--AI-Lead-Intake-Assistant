import React from "react";
import { AlertCircle, RotateCcw, Key, HelpCircle } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  const isKeyError =
    message.toLowerCase().includes("openai_api_key") ||
    message.toLowerCase().includes("authentication") ||
    message.toLowerCase().includes("401");

  const isQuotaError =
    message.toLowerCase().includes("quota") ||
    message.toLowerCase().includes("rate limit") ||
    message.toLowerCase().includes("429");

  return (
    <div className="bg-rose-950/30 rounded-2xl border border-rose-500/30 p-6 shadow-xl backdrop-blur-xl space-y-4">
      <div className="flex items-start space-x-3.5">
        <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 flex-1">
          <h3 className="text-sm font-bold text-rose-200">
            Analysis Request Could Not Be Completed
          </h3>
          <p className="text-xs text-rose-300/90 leading-relaxed font-mono bg-rose-950/60 p-2.5 rounded-lg border border-rose-900/40">
            {message}
          </p>

          {isKeyError && (
            <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Key className="w-4 h-4" />
                <span>How to configure your OpenAI API Key:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1 text-[11px]">
                <li>
                  Open the <code className="text-wadii-300 bg-slate-800 px-1 py-0.5 rounded">server/.env</code> file.
                </li>
                <li>
                  Set <code className="text-wadii-300 bg-slate-800 px-1 py-0.5 rounded">OPENAI_API_KEY=your_actual_key</code>.
                </li>
                <li>
                  Restart the server or retry your request below.
                </li>
              </ol>
            </div>
          )}

          {isQuotaError && (
            <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <HelpCircle className="w-4 h-4" />
                <span>OpenAI Quota Limit:</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Your OpenAI account has reached its spending or rate limit. Verify credits at platform.openai.com.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end pt-2 border-t border-rose-900/40">
        <button
          onClick={onRetry}
          className="flex items-center space-x-1.5 text-xs font-semibold text-rose-100 bg-rose-800/60 hover:bg-rose-700/60 border border-rose-600/40 px-4 py-2 rounded-xl transition-all shadow-md active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Analysis</span>
        </button>
      </div>
    </div>
  );
};
