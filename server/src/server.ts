import { serverConfig } from "./config";
import { app } from "./app";
import connectDB from "./database";
import http from "http";
import { Server } from "socket.io";
import { setupWebSocket } from "./socket";
import { verifySocketJWT } from "./middleware/auth..middleware";

const startServer = async () => {
  await connectDB();

  // Create HTTP server from Express app
  const server = http.createServer(app);

  // Attach Socket.IO to the same server
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://nex-chat-app-ten.vercel.app"],
      credentials: true,
    },
  });

  // Socket authentication
  io.use(verifySocketJWT);
  setupWebSocket(io);

  // Listen on one port for both API and WebSocket
  server.listen(serverConfig.apiPort, () => {
    console.log(
      `Server (API + WebSocket) running at port *:${serverConfig.apiPort}`
    );
  });
};

startServer();
