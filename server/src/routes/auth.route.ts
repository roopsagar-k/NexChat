import express from "express";
import {
  registerController,
  loginController,
  getCurrentUser,
  logoutController,
} from "../controllers/auth.controller";
import { authenticateJWT } from "../middleware/auth..middleware";
import {
  googleLoginController,
  googleCallbackController,
} from "../controllers/auth.oauth.controller";

const authRouter = express.Router();

// Local Auth
authRouter
  .post("/register", registerController)
  .post("/login", loginController)
  .post("/logout", authenticateJWT, logoutController)
  .get("/me", authenticateJWT, getCurrentUser);

// Google OAuth
authRouter.get("/google", googleLoginController);
authRouter.get("/google/callback", googleCallbackController);

export default authRouter;
