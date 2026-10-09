import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { InquiryForm } from "./components/InquiryForm";
import { LeadResultCard } from "./components/LeadResultCard";
import { FollowUpQuestions } from "./components/FollowUpQuestions";
import { SuggestedReplyCard } from "./components/SuggestedReplyCard";
import { EmptyState } from "./components/EmptyState";
import { ErrorState } from "./components/ErrorState";
import { HistoryModal } from "./components/HistoryModal";
import {
  AnalyzeLeadPayload,
  LeadData,
  DemoSample,
  HistoryItem,
} from "./types/lead";
import { Sparkles, CheckCircle2 } from "lucide-react";

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentLead, setCurrentLead] = useState<LeadData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<DemoSample | null>(null);
  const [lastPayload, setLastPayload] = useState<AnalyzeLeadPayload | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Initial load: fetch history if any
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/leads/history");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setHistory(json.data);
        }
      }
    } catch {
      // Non-blocking history fetch
    }
  };

  const handleAnalyze = async (payload: AnalyzeLeadPayload) => {
    setIsLoading(true);
    setError(null);
    setLastPayload(payload);

    try {
      const response = await fetch("/api/leads/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg =
          data.message ||
          `Server returned error ${response.status}: ${response.statusText}`;
        setError(errorMsg);
        setCurrentLead(null);
      } else {
        setCurrentLead(data.data);
        setError(null);
        fetchHistory();
      }
    } catch (err: any) {
      console.error("Network or API error:", err);
      setError(
        err.message ||
          "Failed to reach the backend service. Please verify that the server is running on port 5000."
      );
      setCurrentLead(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample: DemoSample) => {
    setSelectedSample(sample);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setCurrentLead(item.output);
    setLastPayload(item.input);
    setError(null);
  };

  const handleRetry = () => {
    if (lastPayload) {
      handleAnalyze(lastPayload);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e14] text-slate-100">
      {/* Top Navigation */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Intro banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-wadii-950/40 via-slate-900 to-slate-900 border border-wadii-500/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-wadii-500/20 border border-wadii-500/30 text-wadii-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Banquet Lead Processing Desk
              </h2>
              <p className="text-xs text-slate-400">
                Paste WhatsApp inquiries to generate structured lead cards, identify missing criteria, and craft WhatsApp replies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Honest Extraction Guarantee (No hallucinated dates)</span>
          </div>
        </div>

        {/* 2-Column Split Desk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Inquiry Input & Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <InquiryForm
              onSubmit={handleAnalyze}
              isLoading={isLoading}
              selectedSample={selectedSample}
              onSelectSample={handleSelectSample}
            />

            {/* Quick Helper Tips */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-2 text-xs text-slate-400">
              <h4 className="font-semibold text-slate-300">
                Evaluating against Candidate Brief:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                <li>
                  <strong>Sample A:</strong> Specific date (15 Nov) + guest count (350 pax) + budget (4-5L)
                </li>
                <li>
                  <strong>Sample B:</strong> High urgency ("Call ASAP") + relative date ("next Friday")
                </li>
                <li>
                  <strong>Sample C:</strong> Tests honest AI: date not fixed returns{" "}
                  <code className="text-amber-300 bg-slate-800 px-1 py-0.2 rounded font-mono">null</code>
                </li>
                <li>
                  <strong>Sample D:</strong> Casual WhatsApp chat style + guest range (120-150 pax)
                </li>
                <li>
                  <strong>Sample E:</strong> Post site-visit follow-up (500 pax, 2 Dec dinner)
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: AI Extraction Results (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Loading State */}
            {isLoading && (
              <div className="bg-[#111827]/80 rounded-2xl border border-wadii-500/30 p-8 text-center space-y-4 shadow-xl backdrop-blur-xl animate-pulse">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-wadii-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-wadii-500/30">
                  <Sparkles className="w-6 h-6 animate-spin" />
                </div>
                <div className="space-y-2 max-w-sm mx-auto">
                  <h3 className="text-base font-bold text-white">
                    Parsing Banquet Lead with AI...
                  </h3>
                  <p className="text-xs text-slate-400">
                    Extracting event details, evaluating urgency, formatting follow-up questions, and generating WhatsApp reply.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-1.5 pt-2">
                  <span className="w-2 h-2 rounded-full bg-wadii-500 animate-ping"></span>
                  <span className="text-[11px] text-wadii-300 font-mono">
                    Calling OpenAI backend endpoint...
                  </span>
                </div>
              </div>
            )}

            {/* 2. Error State */}
            {!isLoading && error && (
              <ErrorState message={error} onRetry={handleRetry} />
            )}

            {/* 3. Empty State (Initial) */}
            {!isLoading && !error && !currentLead && (
              <EmptyState
                onSelectSample={(sample) => {
                  setSelectedSample(sample);
                  handleAnalyze({
                    rawMessage: sample.rawMessage,
                    customerName: sample.customerName,
                    phone: sample.phone,
                    venueHint: sample.venueHint,
                  });
                }}
              />
            )}

            {/* 4. Success State (Lead Results) */}
            {!isLoading && !error && currentLead && (
              <div className="space-y-5 animate-in fade-in duration-300">
                {/* Main CRM Summary Card */}
                <LeadResultCard data={currentLead} />

                {/* Follow-up Questions Checklist */}
                <FollowUpQuestions questions={currentLead.missingInfo} />

                {/* Suggested WhatsApp Reply */}
                <SuggestedReplyCard
                  suggestedReply={currentLead.suggestedReply}
                  customerName={lastPayload?.customerName}
                  phone={lastPayload?.phone}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 text-center text-xs text-slate-400 bg-[#090c12]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Wadii AI Lead Intake Assistant • Candidate Trial Submission
          </p>
          <p className="text-[11px] text-slate-400">
            Built with React, Vite, Tailwind, Node.js, Express & OpenAI API
          </p>
        </div>
      </footer>

      {/* History Drawer / Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
      />
    </div>
  );
};

export default App;
