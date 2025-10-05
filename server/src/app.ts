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



// CORS Configuration 
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://nex-chat-app-ten.vercel.app",
        "http://localhost:5173",
        "http://localhost:5174", 
      ];

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Debug middleware - REMOVE IN PRODUCTION
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log("Origin:", req.headers.origin);
  console.log("Cookies:", req.cookies);
  next();
});

// Routes
app.use("/api", routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling
app.use((err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    errors: err.errors || [],
  });
});
