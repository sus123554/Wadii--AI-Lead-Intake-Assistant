export type EventType =
  | "wedding"
  | "corporate"
  | "birthday"
  | "engagement"
  | "reception"
  | "other";

export type UrgencyLevel = "low" | "medium" | "high";

export interface LeadData {
  summary: string;
  eventType: string;
  eventDate: string | null;
  eventDateText: string | null;
  guestCount: number | null;
  budgetHint: string | null;
  locationHint: string | null;
  servicesMentioned: string[];
  urgency: UrgencyLevel;
  missingInfo: string[];
  suggestedReply: string;
  confidenceNotes: string;
  confidenceScore?: number;
}

export interface AnalyzeLeadPayload {
  rawMessage: string;
  customerName?: string;
  phone?: string;
  venueHint?: string;
}

export interface AnalyzeLeadResponse {
  success: boolean;
  data?: LeadData;
  message?: string;
}

export interface DemoSample {
  id: string;
  title: string;
  tag: string;
  badgeColor: string;
  rawMessage: string;
  customerName?: string;
  phone?: string;
  venueHint?: string;
  description: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  input: AnalyzeLeadPayload;
  output: LeadData;
}
