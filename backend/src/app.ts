import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import profileRoutes from "./modules/profile/profile.routes";
import modulesRoutes from "./modules/modulo/modulo.routes";
import courseRoutes from "./modules/course/course.routes";
import enrollmentRoutes from "./modules/enrollment/enrollment.routes";
import quizRoutes from "./modules/quiz/quiz.routes";
import quizAttemptRoutes from "./modules/quizAttempt/quizAttempt.routes";
import simulationRoutes from "./modules/simulation/simulation.routes";
import simulationAttemptRoutes from "./modules/simulationAttempt/simuAttempt.routes";
import regulationRoutes from "./modules/regulation/regulation.routes";
import openaiRoutes from "./modules/openai/openai.routes";
import superadminRoutes from "./modules/superadmin/superadmin.routes";
import { requireAuth } from "./middleware/auth.middleware";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// Security headers (helmet)
app.use(helmet());

// CORS restringido a origenes conocidos
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sin Origin (Postman, health checks, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Rate limit global: 300 req/15min por IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(globalLimiter);

// Rate limit estricto para OpenAI: 10 req/hora por usuario autenticado (o IP)
const openaiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  keyGenerator: (req: any) => req.user?.id || req.ip || "unknown",
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "OpenAI rate limit exceeded. Try again in an hour." },
});

app.use(express.json());

// Routes that need to be protected with authentication middleware should be registered after the auth middleware
// Endpoint público para Docker & Kubernetes Health Probes (Liveness / Readiness)
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "aura-backend",
    timestamp: new Date().toISOString(),
  });
});

app.use(requireAuth);
app.use("/api/profile", profileRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/quiz-attempts", quizAttemptRoutes);
app.use("/api/modules", modulesRoutes);
app.use("/api/simulations", simulationRoutes);
app.use("/api/simulations/attempt", simulationAttemptRoutes);
app.use("/api/regulations", regulationRoutes);
app.use("/api/openai", openaiLimiter, openaiRoutes);
app.use("/api/superadmin", superadminRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
