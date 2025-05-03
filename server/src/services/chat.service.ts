import { deleteGroupChat } from "../controllers/chat.controller";
import Chat from "../models/chat.model";
import { Types } from "mongoose";
import ApiError from "../utils/api-error.utils";

export class ChatService {
  static async createOneToOneChat(
    userId: string,
    recipientid: string,
    name: string
  ) {
    const chat = await Chat.find({
      isGroup: false,
      members: { $in: [recipientid, userId] },
    });

    if (chat) {
      return chat;
    }

    const newChat = await Chat.create({
      isGroup: false,
      name,
      members: [recipientid, userId],
    });

    return newChat;
  }

  static async getAllOnetoOneChats(limit = 20, page = 1, userId: string) {
    const skip = (page - 1) * limit;

    const chats = await Chat.find({
      isGroup: false,
      members: { $in: [userId] },
    })
      .skip(skip)
      .limit(limit);

    return chats;
  }

  static async deleteOnetoOneChat(chatId: string) {
    const chat = await Chat.findOneAndDelete({
      _id: chatId,
    });
    return chat;
  }

  static async createGroupChat(
    name: string,
    members: Types.ObjectId[],
    userId: string
  ) {
    const chat = await Chat.create({
      name,
      isGroup: true,
      members: [userId, ...members],
      groupAdmin: userId,
    });

    return await Chat.findById(chat._id)
      .populate("members", "username email")
      .populate("groupAdmin", "username email");
  }

  static async getAllGroupChats(limit = 20, page = 1, userId: string) {
    const skip = (page - 1) * limit;

    const chats = await Chat.find({
      isGroup: true,
      members: { $in: [userId] },
    })
      .skip(skip)
      .limit(limit);

    return chats;
  }

  static async getGroupChatById(chatId: string) {
    const chat = await Chat.findById(chatId);
    return chat;
  }

  static async updateGroupDetails(groupId: string, data: any) {
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: groupId, isGroup: true },
      { $set: data },
      { new: true }
    ).populate("members", "username email");

    return updatedChat;
  }

  static async deleteGroupChat(groupId: string) {
    const deletedChat = await Chat.findOneAndDelete({
      _id: groupId,
      isGroup: true,
    });

    return deletedChat;
  }

  static async addUsersToGroup(
    userId: string,
    groupId: string,
    userIds: string[]
  ) {
    const groupChat = await Chat.findOneAndUpdate(
      { _id: groupId, groupAdmin: userId },
      { $push: { members: { $each: userIds } } },
      { new: true }
    );
    if (groupChat) {
      return true;
    }

    return false;
  }

  static async removeUsersFromGroup(
    userId: string,
    groupId: string,
    userIds: string[]
  ) {
    const groupChat = await Chat.findOneAndUpdate(
      { _id: groupId, groupAdmin: userId },
      { $pull: { members: { $each: userIds } } },
      { new: true }
    );

    return groupChat?.members || null;
  }
}
