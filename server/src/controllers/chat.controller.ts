import { Request, Response } from "express";
import { asyncHandler } from "../services/helpers";
import { ChatService } from "../services/chat.service";
import ApiError from "../utils/api-error.utils";
import ApiResponse from "../utils/api-response.utils";

export const createOrGetOnetoOneChat = asyncHandler(
  async (req: Request, res: Response) => {
    const { recipientid, name } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw ApiError.unauthorized("User not authenticated.");
    }

    const chat = await ChatService.createOneToOneChat(
      userId,
      recipientid,
      name
    );

    if (!chat) {
      throw ApiError.internal(
        "Uable to create one to one chat, Please try again!"
      );
    }
  
    res
      .status(200)
      .json(new ApiResponse(200, chat, "One to one chat created successfully"));
  }
);

export const getAllOnetoOneChats = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = Number(req.query.limit);
    const page = Number(req.query.page);
    const userId = req.user?.id;

    if (!userId) {
      throw ApiError.unauthorized("User not authenticated.");
    }

    const chats = await ChatService.getAllOnetoOneChats(limit, page, userId);
    res
      .status(200)
      .json(
        new ApiResponse(200, chats, "One-2-One chats fetched successfully.")
      );
  }
);

export const deleteOnetoOneChat = asyncHandler(
  async (req: Request, res: Response) => {
    const chatId = req.params.id;
    if (!chatId) {
      throw ApiError.badRequest("Chat id is required for deletion.");
    }

    const chat = await ChatService.deleteOnetoOneChat(chatId);

    if (!chat) {
      throw ApiError.notFound("Chat not found!");
    }

    res
      .status(200)
      .json(new ApiResponse(200, chat, "Chat deleted successfully"));
  }
);

export const createGroupChat = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, members } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw ApiError.unauthorized("User not authenticated");
    }

    if (!name || !members) {
      throw ApiError.badRequest("Name, members is required for group creation");
    }

    const chat = await ChatService.createGroupChat(name, members, userId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          chat,
          `New Group chat is created successfully with name ${name}`
        )
      );
  }
);

export const getAllGroupChats = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query?.page);
    const limit = Number(req.body?.limit);
    const userId = req.user?.id;
    
    if (!userId) {
      throw ApiError.unauthorized("User not authenticated");
    }

    const chats = await ChatService.getAllGroupChats(limit, page, userId);
    res
      .status(chats.length > 0 ? 200 : 204)
      .json(
        new ApiResponse(
          chats.length > 0 ? 200 : 204,
          chats,
          "Group chats fetched successflly"
        )
      );
  }
);

export const getGroupChatById = asyncHandler(
  async (req: Request, res: Response) => {
    const chatId = req.params.id;

    if (!chatId) {
      throw ApiError.badRequest("Chat id required!");
    }

    const chat = await ChatService.getGroupChatById(chatId);
    if (!chat) {
      throw ApiError.notFound("Chat not found!");
    }

    res
      .status(200)
      .json(new ApiResponse(200, chat, "Group chat fetched succesfully"));
  }
);

export const updateGroupDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const groupId = req.params.id;
    const data = req.body;
    if (!groupId) {
      throw ApiError.badRequest("GroupId is required to update details");
    }

    const updatedChat = await ChatService.updateGroupDetails(groupId, data);
    if (!updatedChat) {
      throw ApiError.notFound("Chat not found, update unsuccessfull!");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedChat, "Group Details updated successfully")
      );
  }
);

export const deleteGroupChat = asyncHandler(
  async (req: Request, res: Response) => {
    const groupId = req.params.id;
    if (!groupId) {
      throw ApiError.badRequest("Group Id is required to delete a group");
    }

    const deleteGroup = ChatService.deleteGroupChat(groupId);
    if (!deleteGroup) {
      throw ApiError.notFound("Group not found or already deleted");
    }

    res
      .status(200)
      .json(new ApiResponse(200, deleteGroup, "Group deleted successfully"));
  }
);

export const addUsersToGroup = asyncHandler(
  async (req: Request, res: Response) => {
    const groupId = req.params.id;
    const userId = req.user?.id;
    const { userIds } = req.body;

    if (!userId) {
      throw ApiError.badRequest("User not authenticated");
    }

    if (!userIds || userIds.length === 0) {
      throw ApiError.badRequest(
        "Please provide the users(userIds) to be added"
      );
    }

    if (!groupId) {
      throw ApiError.badRequest("GroupId is required to add users");
    }

    const usersAdded = await ChatService.addUsersToGroup(
      userId,
      groupId,
      userIds
    );
    if (!usersAdded) {
      throw ApiError.internal("Internal error unable to add users");
    }

    res.status(200).json(new ApiResponse(200, {}, "Users added successfully"));
  }
);

export const removeUsersFromGroup = asyncHandler(
  async (req: Request, res: Response) => {
    const groupId = req.params.id;
    const userId = req.user?.id;
    const { userIds } = req.body;

    if (!userId) {
      throw ApiError.badRequest("User not authenticated");
    }

    if (!userIds || userIds.length === 0) {
      throw ApiError.badRequest(
        "Please provide the users(userIds) to be removed"
      );
    }

    if (!groupId) {
      throw ApiError.badRequest("GroupId is required to remove users");
    }

    const deletedUsers = await ChatService.removeUsersFromGroup(
      userId,
      groupId,
      userIds
    );
    if (!deletedUsers) {
      throw ApiError.notFound("Group not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, deletedUsers, "Users removed successfully"));
  }
);
