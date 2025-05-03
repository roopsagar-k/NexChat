import { Server } from "socket.io";
import { Websocket } from "./services/websocket.service";

export function setupWebSocket(io: Server) {
  //initialize websocket
  Websocket.initialize(io);
}
