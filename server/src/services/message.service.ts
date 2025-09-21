import Message from "../models/message.model";
import User from "../models/user.model";

export class MessageService {
  static async getMessages(chatId: string) {
    const messages = await Message.find({ chatId })
      .populate("sender", "username email")
      .sort({ createdAt: 1 });

    return messages;
  }

  static async getMessagesAfterLastSeen(userId: string) {
    const user = await User.findById(userId, { lastActive: 1 });

    if (!user || !user.lastActive) return [];

    const lastSeen = user.lastActive;

    const messages = await Message.find({
      createdAt: { $gt: lastSeen },
      sender: { $ne: userId },
    })
      .populate("sender", "username email")
      .populate("chatId")
      .sort({ createdAt: 1 });

    return messages;
  }

  static async addMessage(userId: string, chatId: string, message: string, attachments: string[]) {
    const createdMessage = await Message.create({
      chatId,
      sender: userId,
      content: message,
      attachments,
    });

    return await Message.findById(createdMessage._id)
      .populate("sender", "username email")
      .populate("chatId");
  }

  static async deleteMessage(messageId: string) {
    const deletedMessage = await Message.findOneAndDelete({
      _id: messageId,
    });
    return deletedMessage;
  }
}
