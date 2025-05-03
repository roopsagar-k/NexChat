import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api-error.utils";

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err) => {
      if (!(err instanceof ApiError)) {
        err = ApiError.internal(err.message || "Unexpected error", [err]);
      }
      next(err);
    });
  };
};
