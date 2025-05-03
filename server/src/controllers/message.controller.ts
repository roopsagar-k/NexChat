import { asyncHandler } from "../services/helpers";
import { Request, Response } from "express";
import ApiError from "../utils/api-error.utils";
import Message from "../models/message.model";
import ApiResponse from "../utils/api-response.utils";

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;
  if (!chatId) {
    throw ApiError.badRequest("ChatId is required to get messages");
  }

  const messages = await Message.find({ chatId })
    .populate("sender", "username email")
    .sort({ createdAt: 1 });

  res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages fetched successfully"));
});
