import exporess from "express";
import { getAllUsers, getUserById } from "../controllers/user.controller";

const userRouter = exporess.Router();

userRouter
  .get("/", getAllUsers)
  .get("/:id", getUserById);

export default userRouter;
