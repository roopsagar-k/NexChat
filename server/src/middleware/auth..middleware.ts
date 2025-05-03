import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/api-error.utils";

export const authenticateJWT = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.headers["cookie"]?.split("=")[1];

  if (!token) {
    return next(ApiError.unauthorized("No token provided"));
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      return next(ApiError.unauthorized("Token is not valid"));
    }
    req.user = user as { id: string; username: string; email: string };
    next();
  });
};
