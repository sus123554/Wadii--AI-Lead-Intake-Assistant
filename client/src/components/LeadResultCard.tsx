import React from "react";
import {
  Calendar,
  Users,
  IndianRupee,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  Flame,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";
import { LeadData, UrgencyLevel } from "../types/lead";

interface LeadResultCardProps {
  data: LeadData;
}

export const LeadResultCard: React.FC<LeadResultCardProps> = ({ data }) => {
  // Format urgency badge
  const renderUrgencyBadge = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case "high":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>High Urgency (ASAP / Impending)</span>
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Medium Urgency (Normal Planning)</span>
          </span>
        );
      case "low":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Low Urgency (Browsing / Unfixed)</span>
          </span>
        );
    }
  };

  const getEventTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "wedding":
        return "bg-rose-950/60 text-rose-300 border-rose-600/40";
      case "corporate":
        return "bg-blue-950/60 text-blue-300 border-blue-600/40";
      case "birthday":
        return "bg-amber-950/60 text-amber-300 border-amber-600/40";
      case "engagement":
        return "bg-emerald-950/60 text-emerald-300 border-emerald-600/40";
      case "reception":
        return "bg-purple-950/60 text-purple-300 border-purple-600/40";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const confidencePercent = Math.round((data.confidenceScore ?? 0.85) * 100);

  return (
    <div className="bg-[#111827]/90 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden space-y-0">
      {/* Top Banner: CRM Lead Summary Header */}
      <div className="p-5 border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-wadii-400">
              CRM Lead Card
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider border ${getEventTypeBadgeColor(
                data.eventType
              )}`}
            >
              {data.eventType}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {renderUrgencyBadge(data.urgency)}
          </div>
        </div>

        {/* 1-2 lines CRM Summary */}
        <p className="text-base font-medium text-slate-100 leading-snug">
          {data.summary}
        </p>
      </div>

      {/* Structured Fields Grid */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-950/50">
        {/* 1. Event Date */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 space-y-1">
          <div className="flex items-center text-xs font-medium text-slate-400 gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-wadii-400" />
            <span>Event Date</span>
          </div>
          <div>
            {data.eventDate ? (
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-emerald-300 font-mono">
                  {data.eventDate}
                </span>
                {data.eventDateText && (
                  <span className="text-xs text-slate-400">
                    ("{data.eventDateText}")
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-amber-400 bg-amber-950/50 border border-amber-600/30 px-2 py-0.5 rounded">
                  Null / Date Not Fixed
                </span>
                {data.eventDateText && (
                  <span className="text-xs text-slate-400 italic">
                    ("{data.eventDateText}")
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 2. Guest Count */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 space-y-1">
          <div className="flex items-center text-xs font-medium text-slate-400 gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Guest Count (Pax)</span>
          </div>
          <div>
            {data.guestCount !== null ? (
              <span className="text-sm font-semibold text-slate-100 font-mono">
                {data.guestCount} Guests
              </span>
            ) : (
              <span className="text-xs text-slate-400 italic">
                Unspecified in inquiry
              </span>
            )}
          </div>
        </div>

        {/* 3. Budget Hint */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 space-y-1">
          <div className="flex items-center text-xs font-medium text-slate-400 gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
            <span>Budget Indication</span>
          </div>
          <div>
            {data.budgetHint ? (
              <span className="text-sm font-semibold text-amber-300">
                {data.budgetHint}
              </span>
            ) : (
              <span className="text-xs text-slate-400 italic">
                Not mentioned (Honest null)
              </span>
            )}
          </div>
        </div>

        {/* 4. Location / Venue */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 space-y-1">
          <div className="flex items-center text-xs font-medium text-slate-400 gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Location / Area</span>
          </div>
          <div>
            {data.locationHint ? (
              <span className="text-sm font-semibold text-slate-200">
                {data.locationHint}
              </span>
            ) : (
              <span className="text-xs text-slate-400 italic">
                No location stated
              </span>
            )}
          </div>
        </div>

        {/* 5. Original Date Phrase */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 space-y-1">
          <div className="flex items-center text-xs font-medium text-slate-400 gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Raw Date Phrase</span>
          </div>
          <div>
            {data.eventDateText ? (
              <span className="text-xs font-medium text-slate-200 font-mono bg-slate-800/80 px-2 py-0.5 rounded border border-white/5">
                "{data.eventDateText}"
              </span>
            ) : (
              <span className="text-xs text-slate-400 italic">None stated</span>
            )}
          </div>
        </div>

        {/* 6. Event Type */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 space-y-1">
          <div className="flex items-center text-xs font-medium text-slate-400 gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Occasion / Category</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-slate-200 capitalize">
              {data.eventType}
            </span>
          </div>
        </div>
      </div>

      {/* Services Mentioned */}
      <div className="p-5 border-t border-white/10 space-y-2">
        <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-300 gap-1.5">
          <Layers className="w-3.5 h-3.5 text-wadii-400" />
          <span>Services & Amenities Requested</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.servicesMentioned && data.servicesMentioned.length > 0 ? (
            data.servicesMentioned.map((service, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800/90 text-slate-200 border border-slate-700/80 shadow-sm capitalize"
              >
                ✓ {service}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">
              No specific services explicitly requested (hall inquiry)
            </span>
          )}
        </div>
      </div>

      {/* AI Confidence & Audit Notes */}
      <div className="p-4 bg-slate-900/40 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2 max-w-2xl">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-300">
              AI Confidence Audit:{" "}
            </span>
            <span className="text-slate-400">{data.confidenceNotes}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto bg-slate-800/80 px-3 py-1.5 rounded-lg border border-white/5">
          <span className="text-[11px] text-slate-400">Confidence:</span>
          <div className="w-16 bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                confidencePercent >= 80
                  ? "bg-emerald-400"
                  : confidencePercent >= 60
                  ? "bg-amber-400"
                  : "bg-rose-400"
              }`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
          <span className="font-mono font-semibold text-slate-200">
            {confidencePercent}%
          </span>
        </div>
      </div>
    </div>
  );
};
