import { Router, Request, Response } from "express";
import {
  analyzeLeadRequestSchema,
  LeadData,
  AnalyzeLeadResponse,
} from "../schemas/lead.schema.js";
import { openAIService } from "../services/openai.service.js";

export const leadsRouter = Router();

// In-memory record for storing last 10 analyses (Phase 2 Bonus)
export interface HistoryLeadItem {
  id: string;
  timestamp: string;
  input: {
    rawMessage: string;
    customerName?: string | null;
    phone?: string | null;
    venueHint?: string | null;
  };
  output: LeadData;
}

const analysisHistory: HistoryLeadItem[] = [];
const MAX_HISTORY = 10;

// Simple in-memory rate limiter (15 requests per minute per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

/**
 * POST /api/leads/analyze
 * Analyzes raw banquet inquiry message and extracts structured fields
 */
leadsRouter.post("/analyze", async (req: Request, res: Response): Promise<void> => {
  const clientIp = (req.ip || req.socket.remoteAddress || "127.0.0.1").toString();

  // Rate limit check
  if (!checkRateLimit(clientIp)) {
    res.status(429).json({
      success: false,
      message: "Rate limit reached (max 20 requests/min). Please try again shortly.",
    });
    return;
  }

  // 1. Input Validation with Zod
  const validationResult = analyzeLeadRequestSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errorDetails = validationResult.error.errors.map((e) => e.message).join(", ");
    res.status(400).json({
      success: false,
      message: errorDetails || "Invalid input: rawMessage is required and cannot be empty",
    });
    return;
  }

  const { rawMessage, customerName, phone, venueHint } = validationResult.data;

  // 2. Process with OpenAI
  try {
    const leadData = await openAIService.analyzeLead({
      rawMessage,
      customerName,
      phone,
      venueHint,
    });

    // 3. Save to in-memory history (last 10 items)
    const historyItem: HistoryLeadItem = {
      id: "lead_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      timestamp: new Date().toISOString(),
      input: { rawMessage, customerName, phone, venueHint },
      output: leadData,
    };

    analysisHistory.unshift(historyItem);
    if (analysisHistory.length > MAX_HISTORY) {
      analysisHistory.pop();
    }

    // 4. Return success response
    const responsePayload: AnalyzeLeadResponse = {
      success: true,
      data: leadData,
    };

    res.status(200).json(responsePayload);
  } catch (error: any) {
    console.error("Error analyzing lead:", error.message || error);

    // Return 502 Bad Gateway if external OpenAI failed, or 500
    const statusCode = error.message?.includes("OpenAI") ? 502 : 500;

    res.status(statusCode).json({
      success: false,
      message:
        error.message ||
        "Failed to extract lead details from inquiry. Please check your OpenAI configuration or try again.",
    });
  }
});

/**
 * GET /api/leads/history
 * Returns the last 10 analyzed leads (Phase 2 bonus)
 */
leadsRouter.get("/history", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    count: analysisHistory.length,
    data: analysisHistory,
  });
});
