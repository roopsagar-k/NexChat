import { Request, Response } from "express";
import { asyncHandler } from "../services/helpers";
import ApiResponse from "../utils/api-response.utils";
import ApiError from "../utils/api-error.utils";
import User from "../models/user.model";

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const query = req.query.search?.toString().toLowerCase();

  if (!userId) {
    throw ApiError.unauthorized("User not authenticated");
  }

  let users = [];
  if (query) {
    users = await User.find({
      $or: [{ name: { $regex: query } }, { email: { $regex: query } }],
      _id: { $ne: userId },
    }).select("-password");
  } else {
    users = await User.find({ _id: { $ne: userId } }).select("-password");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        users,
        users.length > 0 ? "Fetched users successfully" : "No users found"
      )
    );
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    ApiError.unauthorized("User not authenticated");
  }

  const user = await User.findById(userId);
  if (!user) {
    ApiError.notFound("User not found");
  }

  res.status(200).json(new ApiResponse(200, { user }));
});
