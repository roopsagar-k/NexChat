import express, { Request, Response, NextFunction } from "express";
import routes from "./routes";
import ApiError from "./utils/api-error.utils";
import rateLimit from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
      };
    }
  }
}

export const app = express();

// Basic health route
app.get("/", (_req, res) => {
  res.send("<h1>NexChat Server running....</h1>");
});

// Optional rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: true,
});
// app.use("/api", limiter);

// Middleware
app.use(
  cors({
    origin: ["https://nex-chat-app-ten.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Routes
app.use("/api", routes);

// Error handling
app.use((err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    errors: err.errors || [],
  });
});
