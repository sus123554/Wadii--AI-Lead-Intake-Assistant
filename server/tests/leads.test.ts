import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();

beforeAll(() => {
  // Enable demo mock for deterministic unit testing of responses
  process.env.ALLOW_DEMO_MOCK = "true";
});

describe("GET /api/health", () => {
  it("should return ok: true and operational status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.status).toBe("operational");
  });
});

describe("POST /api/leads/analyze Request Validation", () => {
  it("should reject request with missing rawMessage with HTTP 400", async () => {
    const res = await request(app)
      .post("/api/leads/analyze")
      .send({
        customerName: "Rahul",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("rawMessage");
  });

  it("should reject empty rawMessage with HTTP 400", async () => {
    const res = await request(app)
      .post("/api/leads/analyze")
      .send({
        rawMessage: "",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("empty");
  });

  it("should reject whitespace-only rawMessage with HTTP 400", async () => {
    const res = await request(app)
      .post("/api/leads/analyze")
      .send({
        rawMessage: "   \n\t   ",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("empty");
  });

  it("should reject non-string rawMessage with HTTP 400", async () => {
    const res = await request(app)
      .post("/api/leads/analyze")
      .send({
        rawMessage: 12345,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("rawMessage must be a string");
  });

  it("should accept valid payload and return required response schema", async () => {
    const res = await request(app)
      .post("/api/leads/analyze")
      .send({
        rawMessage: "Hi, looking for banquet for wedding 15 Nov, about 350 guests, budget around 4-5L, need decoration + catering, prefer Andheri / Goregaon. Please share packages.",
        customerName: "Rahul Verma",
        phone: "9876543210",
        venueHint: "Andheri / Goregaon"
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();

    const data = res.body.data;
    // Check all required fields from Section 7
    expect(data).toHaveProperty("summary");
    expect(data).toHaveProperty("eventType");
    expect(data).toHaveProperty("eventDate");
    expect(data).toHaveProperty("eventDateText");
    expect(data).toHaveProperty("guestCount");
    expect(data).toHaveProperty("budgetHint");
    expect(data).toHaveProperty("locationHint");
    expect(data).toHaveProperty("servicesMentioned");
    expect(data).toHaveProperty("urgency");
    expect(data).toHaveProperty("missingInfo");
    expect(data).toHaveProperty("suggestedReply");
    expect(data).toHaveProperty("confidenceNotes");

    // Spot check types
    expect(typeof data.summary).toBe("string");
    expect(Array.isArray(data.servicesMentioned)).toBe(true);
    expect(Array.isArray(data.missingInfo)).toBe(true);
    expect(["low", "medium", "high"]).toContain(data.urgency);
  });

  it("should keep unknown dates as null for vague inquiries (Sample C)", async () => {
    const res = await request(app)
      .post("/api/leads/analyze")
      .send({
        rawMessage: "Birthday party for kid, date not fixed, maybe 50 people, looking for cheap package near Borivali.",
        customerName: "Pooja",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.eventDate).toBeNull();
    expect(res.body.data.eventDateText).toBe("date not fixed");
    expect(res.body.data.guestCount).toBe(50);
  });
});
