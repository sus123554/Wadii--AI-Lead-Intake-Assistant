import OpenAI from "openai";
import { AnalyzeLeadRequest, LeadData, leadDataSchema } from "../schemas/lead.schema.js";

// Helper to sanitize error messages so no API keys or internal tokens are ever leaked
function sanitizeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message;
    // Strip anything that looks like an API key (sk-...)
    return msg.replace(/sk-[a-zA-Z0-9_-]{20,}/g, "[REDACTED_API_KEY]");
  }
  return "An unexpected error occurred while communicating with the AI service.";
}

export class OpenAIService {
  private client: OpenAI | null = null;
  private model: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    this.model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

    if (apiKey && apiKey !== "your_openai_api_key_here") {
      this.client = new OpenAI({ apiKey });
    }
  }

  /**
   * Refreshes the OpenAI client if env var changes or was loaded late
   */
  private getClient(): OpenAI {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!this.client) {
      if (!apiKey || apiKey === "your_openai_api_key_here") {
        throw new Error(
          "OPENAI_API_KEY is not configured. Please add a valid OpenAI API key to your server/.env file."
        );
      }
      this.client = new OpenAI({ apiKey });
    }
    return this.client;
  }

  public async analyzeLead(input: AnalyzeLeadRequest): Promise<LeadData> {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    const hasValidKey = apiKey && apiKey !== "your_openai_api_key_here" && !apiKey.startsWith("mock");

    // Optional demo mock mode if explicitly enabled or if no key is configured in demo mode
    if (!hasValidKey && process.env.ALLOW_DEMO_MOCK === "true") {
      return this.generateMockResponse(input);
    }

    // Call official OpenAI API
    const openai = this.getClient();

    const systemPrompt = `You are an expert lead-intake assistant for Indian banquet and venue businesses (Wadii).
Your task is to extract structured lead details from messy customer inquiries received via WhatsApp, Instagram, or email.

CRITICAL INSTRUCTIONS & GROUND TRUTH:
1. HONESTY OVER HYPE:
   - Extract only what the customer explicitly mentions or strongly implies.
   - If a field is unknown, ambiguous, or not provided, return null (or an empty array for services).
   - NEVER invent dates, guest counts, budgets, prices, or guarantee venue availability.
2. DATE HANDLING:
   - "eventDate": Return an ISO date format "YYYY-MM-DD" ONLY if a clear, unambiguous specific calendar date is stated.
   - If the date is vague (e.g. "date not fixed", "mid November", "next Friday evening", "this month end"), return null for "eventDate".
   - "eventDateText": Return the exact raw phrase the customer used for the date/time (e.g. "15 Nov", "next Friday evening", "date not fixed", "mid November", "2 Dec dinner", "this month end"). If no date mentioned at all, return null.
3. EVENT TYPE:
   - Prefer one of: "wedding", "corporate", "birthday", "engagement", "reception", or "other".
4. GUEST COUNT:
   - Extract the number of guests/pax as an integer. If a range is given (e.g., 120-150), take the upper bound or representative integer (e.g. 150). If unknown, return null.
5. BUDGET HINT:
   - Keep user's exact phrasing (e.g. "around 4-5L", "tight under 2L", "cheap package").
   - Do NOT invent rupee amounts if none mentioned (return null).
6. LOCATION HINT:
   - Area, city, or venue preference (e.g. "Andheri / Goregaon", "near Borivali", or venue hints provided). Return null if unspecified.
7. SERVICES MENTIONED:
   - Array of strings representing required services e.g. ["banquet", "catering", "decoration", "hall only", "projector", "stage + lighting", "veg menu"].
8. URGENCY:
   - "high": Mentions "ASAP", "today", "call now", "urgent", or clear date within ~7 days.
   - "medium": Normal planning with a date in the coming weeks/months.
   - "low": Vague / browsing / "maybe" / no date set.
9. MISSING INFO:
   - Provide 2 to 6 concrete, professional follow-up questions a banquet manager needs to ask next (e.g., exact date, veg/non-veg preference, catering requirement, time slot lunch vs dinner, budget range).
10. SUGGESTED REPLY:
   - 2 to 4 short, polite sentences formatted for WhatsApp.
   - Professional, warm Indian hospitality tone (English or light Hinglish where natural).
   - If customer name is known, greet them by name.
   - Acknowledge their request politely.
   - Ask the most critical missing question or invite them for a venue walk-through/call.
   - NEVER invent prices, NEVER confirm a booking, and NEVER promise guaranteed availability.
11. CONFIDENCE NOTES:
   - A concise 1-2 sentence note explaining what details were clear vs what was guessed or missing.
12. CONFIDENCE SCORE:
   - A float between 0.0 and 1.0 indicating overall lead completeness and clarity.

You MUST respond strictly in valid JSON matching this schema:
{
  "summary": "1-2 lines CRM summary",
  "eventType": "wedding | corporate | birthday | engagement | reception | other",
  "eventDate": "YYYY-MM-DD" or null,
  "eventDateText": string or null,
  "guestCount": number or null,
  "budgetHint": string or null,
  "locationHint": string or null,
  "servicesMentioned": string[],
  "urgency": "low" | "medium" | "high",
  "missingInfo": string[],
  "suggestedReply": string,
  "confidenceNotes": string,
  "confidenceScore": number
}`;

    const userPrompt = `Analyze this banquet inquiry message:

MESSAGE:
"""
${input.rawMessage}
"""

ADDITIONAL DETAILS / HINTS:
- Customer Name: ${input.customerName?.trim() || "Not provided"}
- Phone: ${input.phone?.trim() || "Not provided"}
- Preferred Venue / Area Hint: ${input.venueHint?.trim() || "Not provided"}

Remember: Return ONLY valid JSON. Keep unknown values as null. Do not invent dates or prices.`;

    try {
      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1, // Low temperature for deterministic, factual extraction
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("OpenAI returned an empty response.");
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(content);
      } catch (err) {
        throw new Error(`Failed to parse AI response as JSON: ${sanitizeErrorMessage(err)}`);
      }

      // Validate with Zod
      const validated = leadDataSchema.safeParse(parsed);
      if (!validated.success) {
        console.error("Zod validation failed on OpenAI output:", validated.error.format());
        throw new Error(
          `AI output did not match expected lead schema: ${validated.error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join("; ")}`
        );
      }

      return validated.data;
    } catch (error: any) {
      // Map OpenAI specific errors to clear human-readable messages
      const status = error.status || error.statusCode;
      if (status === 401) {
        throw new Error(
          "OpenAI Authentication Failed (401): The OPENAI_API_KEY provided is invalid or expired. Please check server/.env."
        );
      }
      if (status === 429) {
        throw new Error(
          "OpenAI Rate Limit / Quota Exceeded (429): You have exceeded your OpenAI API quota or rate limit. Please check your OpenAI account billing."
        );
      }
      if (status === 500 || status === 503) {
        throw new Error(
          "OpenAI Service Unavailable (503): OpenAI servers are currently experiencing issues. Please try again in a moment."
        );
      }
      throw new Error(sanitizeErrorMessage(error));
    }
  }

  /**
   * Realistic offline demo fallback generator matching the required schema
   * Used for offline resilience or when ALLOW_DEMO_MOCK=true is active.
   */
  private generateMockResponse(input: AnalyzeLeadRequest): LeadData {
    const raw = input.rawMessage.toLowerCase();
    const name = input.customerName || "there";
    const loc = input.venueHint || null;

    if (raw.includes("wedding")) {
      return {
        summary: `Wedding inquiry ~350 guests, ${loc || "Andheri / Goregaon"}, budget ~₹4-5L, date 15 Nov.`,
        eventType: "wedding",
        eventDate: "2026-11-15",
        eventDateText: "15 Nov",
        guestCount: 350,
        budgetHint: "around 4–5L",
        locationHint: loc || "Andheri / Goregaon",
        servicesMentioned: ["banquet", "decoration", "catering"],
        urgency: "medium",
        missingInfo: [
          "Preferred time slot (morning muhurat / evening reception)?",
          "Catering menu preferences (Pure Veg or Non-Veg included)?",
          "Do you need bridal dressing rooms or guest stay rooms?",
        ],
        suggestedReply: `Hi ${name}, thank you for considering us for your wedding celebrations! We can certainly accommodate ~350 guests in ${loc || "Andheri / Goregaon"} with complete catering and decor packages. Would you prefer an evening or daytime slot on 15 Nov, and could we schedule a venue walkthrough this week?`,
        confidenceNotes: "Guest count, budget, and services clearly stated. Specific date 15 Nov mentioned.",
        confidenceScore: 0.95,
      };
    }

    if (raw.includes("corporate") || raw.includes("meetup") || raw.includes("pax")) {
      return {
        summary: "Corporate meetup inquiry ~80 pax, urgent booking, hall + projector only (no food).",
        eventType: "corporate",
        eventDate: null,
        eventDateText: "next Friday evening",
        guestCount: 80,
        budgetHint: null,
        locationHint: loc,
        servicesMentioned: ["hall only", "projector"],
        urgency: "high",
        missingInfo: [
          "Exact date for next Friday?",
          "Required timing/duration (e.g. 5 PM to 9 PM)?",
          "Audio system / mic requirements?",
          "Budget allocation for hall rental?",
        ],
        suggestedReply: `Hi ${name}, thanks for reaching out. We have banquet conference halls well-equipped with projector & AV setups suitable for 80 pax. As this is for next Friday evening, I would like to connect on a quick call right away to check hall availability and block the slot for you.`,
        confidenceNotes: "Urgent lead marked high due to 'next Friday' and 'Call me ASAP'. No budget provided.",
        confidenceScore: 0.88,
      };
    }

    if (raw.includes("birthday") || raw.includes("kid")) {
      return {
        summary: "Birthday party inquiry ~50 people, date unfixed, budget-friendly package near Borivali.",
        eventType: "birthday",
        eventDate: null,
        eventDateText: "date not fixed",
        guestCount: 50,
        budgetHint: "cheap package",
        locationHint: loc || "near Borivali",
        servicesMentioned: ["banquet package"],
        urgency: "low",
        missingInfo: [
          "Tentative month or preferred weekend for the birthday party?",
          "Do you require kids' theme decoration and cake table setup?",
          "Specific budget range in mind?",
        ],
        suggestedReply: `Hi ${name}, thanks for reaching out to us for your kid's birthday celebration! We have affordable celebration packages for 50 guests around Borivali. Do you have a tentative weekend or month in mind so we can share customized options?`,
        confidenceNotes: "Event type and guest count stated. Date is explicitly not fixed (kept null as per guidelines).",
        confidenceScore: 0.72,
      };
    }

    if (raw.includes("engagement") || raw.includes("bro")) {
      return {
        summary: "Engagement inquiry ~120-150 guests, month end, tight budget under ₹2L, veg menu.",
        eventType: "engagement",
        eventDate: null,
        eventDateText: "this month end",
        guestCount: 150,
        budgetHint: "tight under 2L",
        locationHint: loc,
        servicesMentioned: ["hall", "veg menu"],
        urgency: "medium",
        missingInfo: [
          "Exact dates under consideration for this month end?",
          "Lunch or dinner function?",
          "Is basic stage decor included in your ₹2L requirement?",
        ],
        suggestedReply: `Hi ${name}, thanks for contacting us. We can definitely explore options for 120-150 guests with pure veg catering within your ₹2L budget. Which specific dates towards month-end are you considering so we can check open hall slots?`,
        confidenceNotes: "Guest count range (120-150) and ₹2L budget clear. Date is approximate month-end.",
        confidenceScore: 0.85,
      };
    }

    // Default reception or general inquiry
    return {
      summary: `Reception inquiry ~500 guests, 2 Dec dinner, stage + lighting needed. Decision by Monday.`,
      eventType: "reception",
      eventDate: "2026-12-02",
      eventDateText: "2 Dec dinner",
      guestCount: 500,
      budgetHint: null,
      locationHint: loc,
      servicesMentioned: ["stage + lighting", "dinner banquet"],
      urgency: "high",
      missingInfo: [
        "Catering requirements (per plate budget or menu preference)?",
        "Expected guest arrival time for dinner?",
        "Any additional sound or LED screen requirements?",
      ],
      suggestedReply: `Hi ${name}, thank you for following up after your visit yesterday! We are preparing the quotation for your reception on 2 Dec dinner for 500 guests including stage and lighting setups. Could you let us know your catering preferences so we can finalize the best proposal for your Monday decision?`,
      confidenceNotes: "Follow-up inquiry. Date 2 Dec clearly stated. High urgency due to decision deadline by Monday.",
      confidenceScore: 0.92,
    };
  }
}

export const openAIService = new OpenAIService();
