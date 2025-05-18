import express, { Request, Response, NextFunction } from "express";
import { serverConfig } from "./config";
import http from "http";
import routes from "./routes";
import ApiError from "./utils/api-error.utils";
import rateLimit from "express-rate-limit";
import { setupWebSocket } from "./socket";
import { Server } from "socket.io";
import { ENV } from "./config";
import { verifySocketJWT } from "./middleware/auth..middleware";
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
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: true,
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
// app.use("/api", limiter);

//routes
app.use("/api", routes);

//Error handling
app.use((err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    errors: err.errors || [],
  });
});

//sockets authentication
io.use(verifySocketJWT);
setupWebSocket(io);

server.listen(serverConfig.socketPort, () => {
  console.log("Socket server running at port *:" + serverConfig.socketPort);
});
