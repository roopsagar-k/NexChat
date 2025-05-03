import express from "express";
import {
  registerController,
  loginController,
  getCurrentUser,
  logoutController,
} from "../controllers/auth.controller";
import { authenticateJWT } from "../middleware/auth..middleware";

const authRouter = express.Router();

authRouter
  .post("/register", registerController)
  .post("/login", loginController)
  .post("/logout", authenticateJWT, logoutController)
  .get("/me", authenticateJWT, getCurrentUser);

export default authRouter;
