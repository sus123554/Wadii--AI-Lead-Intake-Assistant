import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { leadsRouter } from "./routes/leads.router.js";
import { healthRouter } from "./routes/health.router.js";

// Load environment variables
dotenv.config();

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  // Routes
  app.use("/api/health", healthRouter);
  app.use("/api/leads", leadsRouter);

  // 404 Handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: "API route not found",
    });
  });

  // Global Error Handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled error:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error occurred",
    });
  });

  return app;
}
