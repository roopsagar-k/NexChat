import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/api-error.utils";
import { JWT } from "../services/jwt.service";
import { Socket, ExtendedError } from "socket.io";

export const authenticateJWT = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return next(ApiError.unauthorized("No token provided"));
  }

  const { valid, user, error } = JWT.verifyJWT(token);

  if (!valid && error) {
    return next(ApiError.unauthorized("Token is not valid"));
  }

  req.user = user as { id: string; username: string; email: string };
  next();
};

export const verifySocketJWT = (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  const user = socket.handshake.auth.user;
  console.log("user from socket verify middleware", JSON.stringify(user));
  if (!user) {
    return next(ApiError.unauthorized("Token is not valid"));
  }
  socket.data.user = user;
  return next();
};
