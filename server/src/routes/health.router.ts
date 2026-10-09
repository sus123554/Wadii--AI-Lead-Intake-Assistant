import { Router, Request, Response } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    status: "operational",
    service: "Wadii AI Lead Intake Assistant",
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(
      process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY !== "your_openai_api_key_here"
    ),
  });
});
