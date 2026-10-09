import React, { useState } from "react";
import { MessageSquare, Copy, Check, ExternalLink, CheckCheck } from "lucide-react";

interface SuggestedReplyCardProps {
  suggestedReply: string;
  customerName?: string;
  phone?: string;
}

export const SuggestedReplyCard: React.FC<SuggestedReplyCardProps> = ({
  suggestedReply,
  customerName,
  phone,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyReply = () => {
    navigator.clipboard.writeText(suggestedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build WhatsApp URL if phone is present
  const cleanPhone = phone?.replace(/[^0-9]/g, "");
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(suggestedReply)}`
    : `https://wa.me/?text=${encodeURIComponent(suggestedReply)}`;

  return (
    <div className="bg-[#111827]/90 rounded-2xl border border-white/10 p-5 shadow-xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Suggested WhatsApp Reply
            </h3>
            <p className="text-xs text-slate-400">
              Polite, ready-to-paste customer response (no fake booking promises)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {phone && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-600/30 px-3 py-1.5 rounded-lg transition-all"
              title="Open WhatsApp chat with prefilled message"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Send via WhatsApp</span>
            </a>
          )}

          <button
            onClick={handleCopyReply}
            id="copy-reply-btn"
            className="flex items-center space-x-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 rounded-lg transition-all shadow-md shadow-emerald-900/20 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Reply</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* WhatsApp Message Preview UI */}
      <div className="rounded-xl bg-[#0b141a] border border-white/10 p-4 relative overflow-hidden">
        {/* WhatsApp Chat Header Bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5 text-[11px] text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-emerald-700/80 text-white font-bold flex items-center justify-center text-[10px]">
              {customerName ? customerName[0].toUpperCase() : "G"}
            </div>
            <span className="font-medium text-slate-200">
              {customerName || "Customer Lead"}
            </span>
            {phone && (
              <span className="text-[10px] text-slate-400">({phone})</span>
            )}
          </div>
          <span className="text-[10px] text-slate-400">WhatsApp Preview</span>
        </div>

        {/* Chat Bubble */}
        <div className="flex justify-end">
          <div className="bg-[#005c4b] text-slate-100 rounded-2xl rounded-tr-sm p-3.5 max-w-[92%] sm:max-w-[85%] shadow-md border border-emerald-400/10 space-y-2">
            <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap select-text">
              {suggestedReply}
            </p>
            <div className="flex items-center justify-end space-x-1 text-[10px] text-emerald-200/60 pt-0.5">
              <span>Just now</span>
              <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
