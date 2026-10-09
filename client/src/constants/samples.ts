import { DemoSample } from "../types/lead";

export const DEMO_SAMPLES: DemoSample[] = [
  {
    id: "sample-a",
    title: "Sample A — Wedding",
    tag: "High Value • Specific Date",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    rawMessage:
      "Hi, looking for banquet for wedding 15 Nov, about 350 guests, budget around 4–5L, need decoration + catering, prefer Andheri / Goregaon. Please share packages.",
    customerName: "Rahul Verma",
    phone: "+91 98201 54321",
    venueHint: "Andheri / Goregaon",
    description: "Specific date (15 Nov), clear guest count (350), budget hint (₹4-5L), and full catering+decor requirements.",
  },
  {
    id: "sample-b",
    title: "Sample B — Corporate Urgent",
    tag: "Urgent • Hall Only",
    badgeColor: "bg-red-100 text-red-800 border-red-200",
    rawMessage:
      "Corporate meetup next Friday evening, 80 pax, just hall + projector, no food. Call me ASAP.",
    customerName: "Amit Singhania (TechCorp)",
    phone: "+91 98112 34567",
    venueHint: "BKC or Andheri East",
    description: "High urgency (Call ASAP), relative date (next Friday evening), AV/projector only without food.",
  },
  {
    id: "sample-c",
    title: "Sample C — Birthday Vague",
    tag: "Honest Null Date • Vague",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    rawMessage:
      "Birthday party for kid, date not fixed, maybe 50 people, looking for cheap package near Borivali.",
    customerName: "Neha K.",
    phone: "+91 97654 32109",
    venueHint: "Borivali West",
    description: "Crucial test for honest AI: date is explicitly not fixed (eventDate must be null), vague budget.",
  },
  {
    id: "sample-d",
    title: "Sample D — Engagement Chat",
    tag: "WhatsApp Casual • Veg Menu",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    rawMessage:
      "bro need hall for engagement this month end somehow, 120-150 people, veg menu, budget tight under 2L, which dates open?",
    customerName: "Hardik",
    phone: "+91 99887 76655",
    venueHint: "Malad / Kandivali",
    description: "Casual WhatsApp speech, guest range (120-150), tight budget (< 2L), inquiring for open dates.",
  },
  {
    id: "sample-e",
    title: "Sample E — Reception Follow-up",
    tag: "Large Scale (500 pax) • Stage",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    rawMessage:
      "We already visited your venue yesterday. Need quotation for reception on 2 Dec dinner, 500 guests, stage + lighting. Decision by Monday.",
    customerName: "Dr. Mehra",
    phone: "+91 98210 98765",
    venueHint: "Grand Crystal Ballroom",
    description: "Warm lead follow-up after site visit. Fixed dinner date (2 Dec), high headcount (500 pax), stage & lighting.",
  },
];
