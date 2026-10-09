import React, { useState } from "react";
import {
  Send,
  User,
  Phone,
  MapPin,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AnalyzeLeadPayload, DemoSample } from "../types/lead";
import { SampleSelector } from "./SampleSelector";

interface InquiryFormProps {
  onSubmit: (payload: AnalyzeLeadPayload) => void;
  isLoading: boolean;
  selectedSample: DemoSample | null;
  onSelectSample: (sample: DemoSample) => void;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({
  onSubmit,
  isLoading,
  selectedSample,
  onSelectSample,
}) => {
  const [rawMessage, setRawMessage] = useState<string>(
    selectedSample?.rawMessage || ""
  );
  const [customerName, setCustomerName] = useState<string>(
    selectedSample?.customerName || ""
  );
  const [phone, setPhone] = useState<string>(selectedSample?.phone || "");
  const [venueHint, setVenueHint] = useState<string>(
    selectedSample?.venueHint || ""
  );
  const [showOptionalFields, setShowOptionalFields] = useState<boolean>(true);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(
    selectedSample?.id || null
  );

  const handleSelectSample = (sample: DemoSample) => {
    setActiveSampleId(sample.id);
    setRawMessage(sample.rawMessage);
    setCustomerName(sample.customerName || "");
    setPhone(sample.phone || "");
    setVenueHint(sample.venueHint || "");
    onSelectSample(sample);
  };

  const handleReset = () => {
    setActiveSampleId(null);
    setRawMessage("");
    setCustomerName("");
    setPhone("");
    setVenueHint("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawMessage.trim() || isLoading) return;

    onSubmit({
      rawMessage: rawMessage.trim(),
      customerName: customerName.trim() || undefined,
      phone: phone.trim() || undefined,
      venueHint: venueHint.trim() || undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isFormEmpty = !rawMessage.trim();

  return (
    <div className="bg-[#111827]/90 rounded-2xl border border-white/10 p-5 md:p-6 shadow-xl backdrop-blur-xl space-y-5">
      {/* Sample Selector Buttons */}
      <SampleSelector
        onSelectSample={handleSelectSample}
        selectedSampleId={activeSampleId}
        disabled={isLoading}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Raw WhatsApp Message Area */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="rawMessage"
              className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
            >
              <span>Raw Inquiry Message</span>
              <span className="text-wadii-400 font-bold">*</span>
              <span className="text-[10px] text-slate-400 lowercase font-normal">
                (WhatsApp, Instagram DM, SMS)
              </span>
            </label>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              {rawMessage.length > 0 && (
                <span>{rawMessage.length} chars</span>
              )}
              {activeSampleId && (
                <span className="text-amber-400 bg-amber-950/60 border border-amber-600/30 px-1.5 py-0.5 rounded text-[10px]">
                  Sample Active
                </span>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              id="rawMessage"
              name="rawMessage"
              rows={4}
              value={rawMessage}
              disabled={isLoading}
              onChange={(e) => {
                setRawMessage(e.target.value);
                if (activeSampleId) setActiveSampleId(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Paste customer message here... e.g. 'Hi, need banquet for wedding 15 Nov, about 350 guests, budget around 4-5L...'"
              className="w-full bg-[#0a0d14] border border-white/15 focus:border-wadii-500 focus:ring-1 focus:ring-wadii-500 rounded-xl p-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all resize-y min-h-[105px] font-sans"
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">Ctrl + Enter</kbd> to analyze instantly
          </p>
        </div>

        {/* Optional Metadata Toggle */}
        <div className="border border-white/10 rounded-xl bg-slate-900/40 overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => setShowOptionalFields(!showOptionalFields)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-wadii-400" />
              <span>Optional Customer & Venue Context</span>
              <span className="text-[10px] text-slate-400 font-normal">
                (Simulates CRM caller-ID or manager hints)
              </span>
            </div>
            {showOptionalFields ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showOptionalFields && (
            <div className="p-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950/40">
              {/* Customer Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>Customer Name</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  disabled={isLoading}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Verma"
                  className="w-full bg-[#0a0d14] border border-white/10 focus:border-wadii-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none transition-all"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>Phone / WhatsApp</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  disabled={isLoading}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-[#0a0d14] border border-white/10 focus:border-wadii-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none transition-all"
                />
              </div>

              {/* Venue / Area Hint */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Preferred Venue / Area</span>
                </label>
                <input
                  type="text"
                  value={venueHint}
                  disabled={isLoading}
                  onChange={(e) => setVenueHint(e.target.value)}
                  placeholder="e.g. Andheri West, Grand Ballroom"
                  className="w-full bg-[#0a0d14] border border-white/10 focus:border-wadii-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading || isFormEmpty}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Form</span>
          </button>

          <button
            type="submit"
            disabled={isLoading || isFormEmpty}
            className={`px-6 py-2.5 rounded-xl font-medium text-sm text-white flex items-center space-x-2 transition-all duration-200 shadow-lg ${
              isLoading || isFormEmpty
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5"
                : "bg-gradient-to-r from-wadii-600 via-wadii-500 to-amber-600 hover:from-wadii-500 hover:to-amber-500 shadow-wadii-600/30 hover:shadow-wadii-500/40 hover:scale-[1.01] active:scale-[0.99] border border-wadii-400/30"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Analyzing Lead with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Analyze Lead</span>
                <Send className="w-3.5 h-3.5 opacity-80" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
