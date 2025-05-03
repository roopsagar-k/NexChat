import Message from "../models/message.model";

export class MessageService {
  static async getMessages(chatId: string) {
    const messages = await Message.find({ chatId })
      .populate("sender", "username email")
      .sort({ createdAt: 1 });

    return messages;
  }

  static async addMessage(userId: string, chatId: string, message: string) {
    const createdMessage = await Message.create({
      chatId,
      senderId: userId,
      content: message,
    });

    return await Message.findById(createdMessage._id)
      .populate("senderId", "username email")
      .populate("chatId");
  }

  static async deleteMessage(messageId: string) {
    const deletedMessage = await Message.findOneAndDelete({
      _id: messageId,
    });
    return deletedMessage;
  }
}
