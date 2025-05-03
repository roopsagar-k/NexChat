import { asyncHandler } from "../services/helpers";
import { Request, Response } from "express";
import ApiError from "../utils/api-error.utils";
import ApiResponse from "../utils/api-response.utils";
import { MessageService } from "../services/message.service";

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;
  if (!chatId) {
    throw ApiError.badRequest("ChatId is required to get messages");
  }

  const messages = await MessageService.getMessages(chatId);

  if (!messages) {
    throw ApiError.notFound("Chat not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages fetched successfully"));
});
