import express from "express";
import authRouter from "./auth.route";
import userRouter from "./users.route";
import chatRouter from "./chat.route";
import messageRouter from "./message.route";
import storageRouter from "./storage.route";
import { authenticateJWT } from "../middleware/auth..middleware";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", authenticateJWT, userRouter);
router.use("/chats", authenticateJWT, chatRouter);
router.use("/messages", authenticateJWT, messageRouter);
router.use("/storage", authenticateJWT, storageRouter);

export default router;
