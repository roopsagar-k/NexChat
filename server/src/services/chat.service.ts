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
    const existingChat = await Chat.findOne({
      isGroup: false,
      members: { $all: [recipientid, userId] },
    }).populate("members", "username email name");

    if (existingChat) {
      return existingChat;
    }

    const newChat = await Chat.create({
      isGroup: false,
      name,
      members: [recipientid, userId],
    });

    return await Chat.findById(newChat._id).populate(
      "members",
      "username email name"
    );
  }

  static async getAllOnetoOneChats(limit = 20, page = 1, userId: string) {
    const skip = (page - 1) * limit;

    const chats = await Chat.find({
      isGroup: false,
      members: { $in: [userId] },
    })
      .skip(skip)
      .limit(limit)
      .populate("members", "username email name");

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
      .populate("members", "username email name")
      .populate("groupAdmin", "username email name");
  }

  static async getAllGroupChats(limit = 20, page = 1, userId: string) {
    const skip = (page - 1) * limit;

    const chats = await Chat.find({
      isGroup: true,
      members: { $in: [userId] },
    })
      .skip(skip)
      .limit(limit)
      .populate("members", "username email name");

    return chats;
  }

  static async getGroupChatById(chatId: string) {
    const chat = await Chat.findById(chatId)
      .populate("members", "username email name")
      .populate("groupAdmin", "username email name");
    return chat;
  }

  static async updateGroupDetails(groupId: string, data: any) {
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: groupId, isGroup: true },
      { $set: data },
      { new: true }
    )
      .populate("members", "username email name")
      .populate("groupAdmin", "username email name");

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
    ).populate("members", "username email name");

    if (groupChat) {
      return groupChat;
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
      { $pull: { members: { $in: userIds } } },
      { new: true }
    ).populate("members", "username email name");

    return groupChat || null;
  }
}
