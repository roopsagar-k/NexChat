import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model";
import { JWT } from "../services/jwt.service";
import { asyncHandler } from "../services/helpers";
import ApiError from "../utils/api-error.utils";
import { ENV } from "../config/env";

const client = new OAuth2Client({
  clientId: ENV.GOOGLE_CLIENT_ID,
  clientSecret: ENV.GOOGLE_CLIENT_SECRET,
  redirectUri: `${ENV.BACKEND_URL}/api/auth/google/callback`,
});

// Redirect to Google consent screen
export const googleLoginController = (req: Request, res: Response) => {
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
    prompt: "consent",
  });
  res.redirect(url);
};

// Handle Google callback
export const googleCallbackController = asyncHandler(
  async (req: Request, res: Response) => {
    const code = req.query.code as string;
    if (!code) return res.status(400).send("No code provided");

    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email)
      throw ApiError.badRequest("Google OAuth failed!");

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        username: payload.name,
        email: payload.email,
        password: "google-oauth",
      });
    }

    const token = JWT.generateToken({
      id: user._id,
      username: user.username,
      email: user.email,
    });

    // Redirect to frontend with token
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
      })
      .redirect(`${ENV.CLIENT_URL}/home`);
  }
);
