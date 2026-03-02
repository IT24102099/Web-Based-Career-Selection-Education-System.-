import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import quizRoutes from "./routes/quizRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import alternativeRoutes from "./routes/alternativeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import eligibilityRoutes from "./routes/eligibilityRoutes.js";
import { errorHandler, notFound } from "./middleware/errors.js";

dotenv.config();

const app = express();

// DB
await connectDB();

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// CORS
const clientUrlsRaw = process.env.CLIENT_URLS || process.env.CLIENT_URL || "";
const allowedOrigins = new Set(
  clientUrlsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
);

app.use(cors({
  origin: (origin, cb) => {
    // allow non-browser clients (curl/postman)
    if (!origin) return cb(null, true);
    // allow explicit allowlist
    if (allowedOrigins.has(origin)) return cb(null, true);
    // dev convenience: allow any localhost port
    if (/^http:\/\/localhost:\d+$/.test(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// Routes
app.get("/", (req, res) => res.json({ ok: true, name: "Career Guidance API" }));
app.use("/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/alternatives", alternativeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/eligibility", eligibilityRoutes);

// 404 & error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
