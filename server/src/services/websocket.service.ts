import { Server } from "socket.io";

export class Websocket {
  private static instance: Websocket;
  private io: Server;
  private users: Map<string, string>;

  constructor(io: Server) {
    this.io = io;
    this.users = new Map();
    this.setUpListners();
  }

  public static intialize(io: Server) {
    if (!Websocket.instance) {
      Websocket.instance = new Websocket(io);
    }
    return Websocket.instance;
  }

  public static getIntance() {
    if (!Websocket.instance) {
      throw new Error("Websocket instance not found");
    }
    return Websocket.instance;
  }

  private setUpListners() {
    this.io.on("connection", (socket) => {
      console.log("New user added to the connection with socketId", socket.id);

      //Register user
      socket.on("register-user", () => {
        const userId = socket.data.user.id;
        if (userId) {
          this.users.set(userId, socket.id);
        }
        console.log(`New user registered with userId: ${userId}`);
      });

      //Chat room events
      socket.on("join-chat", () => {});

      socket.on("leave-chat", () => {});

      //Message events
      socket.on("new-message", () => {});

      socket.on("message-received", () => {});

      socket.on("typing", () => {});

      socket.on("stop-typing", () => {});

      socket.on("message-deleted", () => {});

      //Group Management Events
      socket.on("group-created", () => {});

      socket.on("group-updated", () => {});

      socket.on("user-added-to-group", () => {});

      socket.on("user-removed-from-group", () => {});

      //handle disconnect
      socket.on("disconnect", () => {
        this.removeUser(socket.id);
      });
    });
  }

  private removeUser(socketId: string) {
    for (const [userId, id] of this.users.entries()) {
      if (socketId === id) {
        this.users.delete(userId);
        console.log(`🗑 Removed User ${userId} from active connections`);
      }
    }
  }
}
