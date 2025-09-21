import { Server, Socket } from "socket.io";
import { MessageService } from "./message.service";
import ApiError from "../utils/api-error.utils";
import User from "../models/user.model";
import { ENV } from "../config";

export class Websocket {
  private static instance: Websocket;
  private io: Server;
  private users: Map<string, string>; // userId -> socketId

  private constructor(io: Server) {
    console.log("contructor called")
    this.io = io;
    this.users = new Map();
    this.setUpListeners();
  }

  public static initialize(io: Server) {
    if (!Websocket.instance) {
      Websocket.instance = new Websocket(io);
    }
    return Websocket.instance;
  }

  public static getInstance() {
    if (!Websocket.instance) throw new Error("Websocket not initialized");
    return Websocket.instance;
  }

  private setUpListeners() {
    this.io.on("connection", (socket: Socket) => {
      const userId = socket.data.user._id;
      console.log("new connection found with socketid", socket.id);

      socket.on("register-user", async () => {
        console.log("register user event triggered")
        if (userId) {
          this.users.set(userId, socket.id);
          const notifications = await MessageService.getMessagesAfterLastSeen(
            userId
          );
          socket.emit("notify-unread-messages", { notifications });
        }
      });

      //Chat Events
      socket.on("join-chat", ({ chatId }) => {
        socket.join(chatId);
        socket.emit("chat-joined", { chatId });
      });

      socket.on("leave-chat", ({ chatId }) => {
        socket.leave(chatId);
        socket.emit("chat-left", { chatId });
      });

      // Message events
      socket.on("new-message", async ({ chatId, content, keys, tempId }) => {
        const attachments = keys?.map((key: string) => `${ENV.CDN_URL}/${key}`) || [];
        const created = await MessageService.addMessage(
          userId!,
          chatId,
          content,
          attachments,
        );

        socket.to(chatId).emit("new-message-received", { message: created });
        socket.emit("message-sent", { message: created, tempId });
      });

      socket.on("message-received", ({ messageId, chatId }) => {
        socket.to(chatId).emit("message-delivered", { messageId });
      });

      socket.on("typing", ({ chatId }) => {
        socket.to(chatId).emit("user-typing", { userId, chatId });
      });

      socket.on("stop-typing", ({ chatId }) => {
        socket.to(chatId).emit("user-stopped-typing", { userId, chatId });
      });

      socket.on("message-deleted", async ({ messageId, chatId }) => {
        await MessageService.deleteMessage(messageId);
        this.io.in(chatId).emit("message-deleted", { messageId });
      });

      // Group Management Events
      socket.on("group-created", async ({ name, members, groupId }) => {
        members.forEach((m: string) => {
          const sid = this.users.get(m);
          if (sid) {
            const socket = this.io.sockets.sockets.get(sid);
            socket?.join(groupId);
          }
        });
        this.io.in(groupId).emit("group-created", { groupName: name });
      });

      socket.on("group-updated", async ({ groupId, updated }) => {
        this.io.in(groupId).emit("group-updated", { group: updated });
      });

      socket.on(
        "user-added-to-group",
        async ({ groupId, userIds, updated }) => {
          userIds.forEach((u: string) => {
            const sid = this.users.get(u);
            if (sid) this.io.sockets.sockets.get(sid)?.join(groupId);
          });

          this.io
            .in(groupId)
            .emit("group-user-added", { group: updated, added: userIds });
        }
      );

      socket.on(
        "user-removed-from-group",
        async ({ groupId, userIds, updated }) => {
          userIds.forEach((u: string) => {
            const sid = this.users.get(u);
            if (sid) this.io.sockets.sockets.get(sid)?.leave(groupId);
          });
          this.io
            .in(groupId)
            .emit("group-user-removed", { group: updated, removed: userIds });
        }
      );

      socket.on("disconnect", async () => {
        for (const [uid, sid] of this.users.entries()) {
          if (sid === socket.id) {
            this.users.delete(uid);
            await User.findByIdAndUpdate(uid, { lastActive: new Date() });
            break;
          }
        }
      });
    });
  }
}
