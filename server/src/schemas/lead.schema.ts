import { z } from "zod";

// Request Body Schema
export const analyzeLeadRequestSchema = z.object({
  rawMessage: z
    .string({
      required_error: "rawMessage is required",
      invalid_type_error: "rawMessage must be a string",
    })
    .trim()
    .min(1, "rawMessage cannot be empty or whitespace-only"),
  customerName: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  venueHint: z.string().optional().nullable(),
});

export type AnalyzeLeadRequest = z.infer<typeof analyzeLeadRequestSchema>;

// Lead Data Schema
export const leadDataSchema = z.object({
  summary: z.string().describe("1-2 lines CRM summary of the lead"),
  eventType: z
    .string()
    .describe("Event type: wedding, corporate, birthday, engagement, reception, other"),
  eventDate: z
    .string()
    .nullable()
    .describe("ISO date YYYY-MM-DD if explicitly mentioned or clearly calculable; null if unknown"),
  eventDateText: z
    .string()
    .nullable()
    .describe("Raw date text from inquiry e.g. 'mid November', 'next Friday', or null"),
  guestCount: z
    .number()
    .nullable()
    .describe("Estimated or exact guest count as integer, or null if unknown"),
  budgetHint: z
    .string()
    .nullable()
    .describe("User's budget wording e.g. 'around 4-5L', 'under 2L', or null. Never invent amounts"),
  locationHint: z
    .string()
    .nullable()
    .describe("Area, city, or venue preference e.g. 'Andheri / Goregaon', or null"),
  servicesMentioned: z
    .array(z.string())
    .describe("List of services requested e.g. catering, decoration, hall only, projector"),
  urgency: z
    .enum(["low", "medium", "high"])
    .describe("high (ASAP/7 days), medium (normal planning), low (vague/no date)"),
  missingInfo: z
    .array(z.string())
    .min(1)
    .describe("2-6 concrete follow-up questions a banquet manager would ask"),
  suggestedReply: z
    .string()
    .describe("2-4 polite, WhatsApp-friendly sentences. Do not invent prices or confirm booking"),
  confidenceNotes: z
    .string()
    .describe("Notes explaining what was clear vs guessed or missing"),
  confidenceScore: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe("Estimated confidence score between 0 and 1"),
});

export type LeadData = z.infer<typeof leadDataSchema>;

// API Response Shapes
export interface AnalyzeLeadSuccessResponse {
  success: true;
  data: LeadData;
}

export interface AnalyzeLeadErrorResponse {
  success: false;
  message: string;
  error?: string;
}

export type AnalyzeLeadResponse = AnalyzeLeadSuccessResponse | AnalyzeLeadErrorResponse;
