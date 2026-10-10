# Wadii AI Lead Intake Assistant 🏛️✨

An intelligent, production-grade AI intake prototype engineered specifically for Indian banquet, venue, and convention businesses. The assistant ingests messy customer inquiries arriving from WhatsApp, Instagram DMs, SMS, or phone calls, rigorously extracts structured CRM fields, identifies missing information questions, and generates polite, ready-to-paste WhatsApp replies—without hallucinating unstated dates or prices.

---

## 🎯 Executive Overview & Product Summary

In the Indian banquet industry, venue owners and banquet sales managers handle dozens of high-value event inquiries every week over WhatsApp. These inquiries are notoriously informal, fragmented, and unstructured (e.g., *"bro need hall for engagement this month end somehow, 120-150 people, veg menu, budget tight under 2L"*). 

Managers typically waste 10–15 minutes manually deciphering each message, asking repetitive questions, and entering details into CRM software. **Wadii AI Lead Intake Assistant** bridges this gap:
1. **Instant Structured Extraction:** Accurately identifies occasion/event type, guest count (pax), budget indications, preferred areas, and requested amenities.
2. **Honesty Over Hype:** Strictly enforces `null` for unknown parameters. It never invents dates or promises unconfirmed prices or availability.
3. **Manager Missing Info Checklist:** Identifies 2–6 crucial follow-up questions needed to prepare a formal quotation (muhurat timing, veg/non-veg catering, hall only vs complete decor).
4. **WhatsApp-Ready Suggested Reply:** Drafts a courteous, professionally phrased response formatted for WhatsApp that managers can copy in one click or send directly.

---

## 📸 Screenshots & Walkthrough

*(Replace with actual demo screenshots/GIFs prior to final submission)*

| Dashboard Overview & Sample Inquiries | Structured CRM Card & WhatsApp Reply |
| :---: | :---: |
| ![Wadii AI Input](https://via.placeholder.com/600x350/111827/e3743c?text=Wadii+Lead+Intake+Inquiry+Desk) | ![Structured Results](https://via.placeholder.com/600x350/111827/10b981?text=Structured+Lead+Card+%2B+Suggested+Reply) |

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide React icons.
- **Backend:** Node.js, Express, TypeScript, Zod schema validation.
- **AI Engine:** Official OpenAI API (`gpt-4o-mini` default / `gpt-4o`), called **strictly on the backend**.
- **Testing:** Vitest & Supertest for backend request validation and schema adherence.

```
wadii-ai-lead-intake-assistant/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Header, InquiryForm, LeadResultCard, etc.
│   │   ├── constants/          # 5 realistic Indian banquet samples
│   │   ├── types/              # Mirrored response & lead types
│   │   ├── App.tsx             # Main dashboard workflow
│   │   └── main.tsx
│   ├── tailwind.config.js      # Tailored Indian luxury hospitality theme
│   └── vite.config.ts          # API reverse proxy to backend (:5000)
├── server/                     # Express + TypeScript Backend
│   ├── src/
│   │   ├── routes/             # POST /api/leads/analyze & GET /api/health
│   │   ├── schemas/            # Zod validation schemas for input & AI output
│   │   ├── services/           # OpenAI service with strict JSON parsing
│   │   ├── app.ts              # Express application factory
│   │   └── index.ts            # Server entrypoint
│   ├── tests/                  # Supertest validation test suite
│   ├── .env.example            # Backend env template
│   └── tsconfig.json
├── .env.example                # Root env template
├── .gitignore                  # Prevents secrets, node_modules, and dist commits
└── package.json                # Unified project runner
```

---

## 📋 Prerequisites

- **Node.js:** v18.0.0 or higher (Tested on `v20.14.0 LTS`)
- **npm:** v9.0.0 or higher (Tested on `v10.7.0`)
- **OpenAI API Key:** A valid API key with access to Chat Completions (`gpt-4o-mini` or `gpt-4o`).

---

## ⚡ Quickstart Setup Guide

### 1. Clone the repository
```bash
git clone <YOUR_GIT_REPO_URL>
cd "Wadii_AI Lead Intake Assistant"
```

### 2. Configure Environment Variables
Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```

Open `server/.env` and insert your OpenAI API key:
```ini
PORT=5000
OPENAI_API_KEY=sk-proj-yourActualOpenAIApiKeyHere
OPENAI_MODEL=gpt-4o-mini
```
> **Security Notice:** The OpenAI key is loaded and used exclusively by the backend. It is never exposed to the frontend or bundled into client code. `.env` is explicitly ignored in `.gitignore`.

### 3. Install Dependencies
You can install dependencies for root, server, and client with one command:
```bash
npm run install:all
```
*(Or manually run `npm install` inside the root, `server/`, and `client/` directories).*

### 4. Run the Full-Stack Application
Start both the backend server and frontend client concurrently:
```bash
npm run dev
```
- **Backend API:** `http://localhost:5000`
- **Frontend Dashboard:** `http://localhost:3000`
- **Health Check:** `http://localhost:5000/api/health`

### 5. Run Backend Validation Tests
```bash
npm test
```
Runs the Vitest suite verifying HTTP 400 rejection for empty messages, whitespace-only inquiries, invalid types, and strict schema adherence.

---

## 🔒 Environment Variables

| Variable | Scope | Description | Default / Example |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend | Port for Express server | `5000` |
| `OPENAI_API_KEY` | Backend | Secret OpenAI API key (never expose to client) | `sk-proj-...` |
| `OPENAI_MODEL` | Backend | Model for extraction | `gpt-4o-mini` |
| `ALLOW_DEMO_MOCK` | Backend | Optional fallback generator for offline testing | `false` |

---

## 📡 API Contract

### 1. `POST /api/leads/analyze`
Extracts structured lead data from messy inquiries.

#### Request Headers
```http
Content-Type: application/json
```

#### Request Body
```json
{
  "rawMessage": "Hi, looking for banquet for wedding 15 Nov, about 350 guests, budget around 4–5L, need decoration + catering, prefer Andheri / Goregaon. Please share packages.",
  "customerName": "Rahul Verma",
  "phone": "+91 98201 54321",
  "venueHint": "Andheri / Goregaon"
}
```
- `rawMessage` *(string, required)*: Non-empty string. Rejects whitespace-only with HTTP 400.
- `customerName` *(string, optional)*: Customer name if detected from caller ID or chat.
- `phone` *(string, optional)*: Contact number.
- `venueHint` *(string, optional)*: Specific venue hall or geographic zone.

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "summary": "Wedding inquiry ~350 guests, Andheri / Goregaon, budget ~₹4-5L, date 15 Nov.",
    "eventType": "wedding",
    "eventDate": "2026-11-15",
    "eventDateText": "15 Nov",
    "guestCount": 350,
    "budgetHint": "around 4–5L",
    "locationHint": "Andheri / Goregaon",
    "servicesMentioned": [
      "banquet",
      "decoration",
      "catering"
    ],
    "urgency": "medium",
    "missingInfo": [
      "Preferred time slot (morning muhurat / evening reception)?",
      "Catering menu preferences (Pure Veg or Non-Veg included)?",
      "Do you need bridal dressing rooms or guest stay rooms?"
    ],
    "suggestedReply": "Hi Rahul Verma, thank you for considering us for your wedding celebrations! We can comfortably accommodate ~350 guests with our decor and catering packages in Andheri / Goregaon. Could you let us know if you prefer a morning or evening muhurat slot on 15 Nov, and when we could schedule a venue walkthrough?",
    "confidenceNotes": "Specific date 15 Nov, headcount, and budget stated clearly. Time slot and menu details missing.",
    "confidenceScore": 0.95
  }
}
```

#### Error Response (`400 Bad Request`)
```json
{
  "success": false,
  "message": "rawMessage cannot be empty or whitespace-only"
}
```

#### Error Response (`502 Bad Gateway` / `500 Internal Server Error`)
```json
{
  "success": false,
  "message": "OpenAI Authentication Failed (401): The OPENAI_API_KEY provided is invalid or expired."
}
```

---

### 2. `GET /api/health`
Health check and operational status.
```json
{
  "ok": true,
  "status": "operational",
  "service": "Wadii AI Lead Intake Assistant",
  "timestamp": "2026-10-09T16:20:00.000Z",
  "aiConfigured": true
}
```

---

## 🧪 Realistic Demo Samples Included

The UI provides one-click buttons to evaluate the 5 scenarios specified in the trial brief:

1. **Sample A — Wedding:** High-value inquiry with specific date (15 Nov), 350 guests, budget ₹4–5L, decor + catering in Andheri/Goregaon.
2. **Sample B — Corporate Urgent:** High urgency (`Call ASAP`), relative timing (*"next Friday evening"*), 80 pax, hall + projector only (no catering).
3. **Sample C — Birthday Vague:** **The Honest AI Test.** Customer specifies *"date not fixed"*, ~50 people, cheap package near Borivali. Evaluates that `eventDate` correctly returns `null` rather than a made-up calendar date.
4. **Sample D — Engagement (WhatsApp Style):** Colloquial chat (*"bro need hall for engagement this month end somehow, 120-150 people, veg menu, budget tight under 2L"*). Tests range handling and veg menu tagging.
5. **Sample E — Reception Follow-up:** Warm post-visit lead (*"visited your venue yesterday, quotation for 2 Dec dinner, 500 guests, stage + lighting, decision by Monday"*).

---

## 🏗️ How I Would Plug This into a Real CRM Later

In a full-scale Wadii CRM deployment, this assistant would serve as an asynchronous ingestion pipeline:

```
[ WhatsApp Business API / Webhook ] 
                 │
                 ▼
     [ Ingestion Gateway / BullMQ ]
                 │
                 ▼
 [ Wadii Lead Extraction Worker (LLM) ]
                 │
                 ├──► Store Lead in MongoDB / Postgres (`leads` table)
                 ├──► Create Notification for On-Duty Banquet Manager
                 └──► Webhook / Socket.io Event to Manager Dashboard
```

1. **Inbound Webhook Integration:** Connect to WhatsApp Cloud API / Twilio / Gupshup webhooks. When an incoming message arrives, enqueue an extraction job into a Redis-backed queue (e.g., BullMQ) to handle bursts smoothly.
2. **Multi-turn Context & Conversation Threading:** Instead of analyzing a single message in isolation, maintain conversation thread history (`conversationId`). When the customer replies with their missing info (e.g. *"Evening reception slot"*), the AI updates the existing lead record rather than creating a duplicate.
3. **Venue Availability & Rate Card Augmentation (RAG):** Inject real-time calendar availability and banquet hall rate cards as context into the prompt:
   - *"Crystal Ballroom is AVAILABLE on 15 Nov evening at ₹1,800/plate"*.
   - Enables the suggested reply to propose verified open slots and accurate menu packages automatically.
4. **Role-Based Escalation:** If urgency is `high` or guest count exceeds 500 pax, immediately trigger an SMS/WhatsApp alert to the General Manager.
5. **Two-Way CRM Synchronization:** Sync the validated lead directly into Wadii's Quotation Generator, auto-populating per-plate rates, tax estimates, and PDF proposal drafts.

---

##  Limitations

1. **Single-Message Scope:** The prototype processes one message payload at a time. It does not yet carry conversational memory across a back-and-forth chat thread.
2. **Calendar Year Anchoring:** Dates without a year (e.g., *"15 Nov"*) assume the upcoming occurrence. In rare cases where a customer is booking 14 months in advance, manager confirmation is required.
3. **No Direct WhatsApp Dispatch:** The prototype generates a formatted reply with a 1-click **Copy Reply** button and a `wa.me` link; direct automated sending is omitted to prevent accidental client commitments without manager review.

---
