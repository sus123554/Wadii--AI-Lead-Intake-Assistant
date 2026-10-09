import { createApp } from "./app.js";

const app = createApp();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

app.listen(PORT, () => {
  console.log(`🚀 Wadii AI Lead Intake Server listening on port ${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👉 Analyze endpoint: POST http://localhost:${PORT}/api/leads/analyze`);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your_openai_api_key_here") {
    console.warn("⚠️  NOTE: OPENAI_API_KEY is not set in server/.env. Calls to OpenAI will return an informative error unless mock demo fallback is enabled.");
  } else {
    // Only log the first 4 chars for safety confirmation, never the full key
    const prefix = apiKey.substring(0, Math.min(4, apiKey.length));
    console.log(`🔑 OpenAI API Key configured (starts with '${prefix}****')`);
  }
});
