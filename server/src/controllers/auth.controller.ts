import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../services/helpers";
import ApiError from "../utils/api-error.utils";
import { AuthService } from "../services/auth.service";
import ApiResponse from "../utils/api-response.utils";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model";
import { JWT } from "../services/jwt.service";

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri:
    "http://ko4sk4w4s80kw8kw8g4okwwg.89.117.36.149.sslip.io/api/auth/google/callback",
});

export const registerController = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { username, email, password } = req.body;

    if (!username)
      throw ApiError.badRequest(
        "Username is required for registering the user."
      );
    if (!email)
      throw ApiError.badRequest("Email is required for registering the user.");
    if (!password)
      throw ApiError.badRequest(
        "Password is required for registering the user."
      );

    const newUser = await AuthService.registerUser(username, password, email);
    console.log(newUser);
    res
      .status(201)
      .json(
        new ApiResponse(201, { user: newUser }, "User successfully created")
      );
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw ApiError.badRequest(
        "Email and password is requied for logging in."
      );
    }

    const token = await AuthService.loginUser(email, password);
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
      .json(
        new ApiResponse(200, { token }, "User authenticated successfully.")
      );
  }
);

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
      throw ApiError.unauthorized("Google OAuth failed!");

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
      .cookie("token", token)
      .redirect(`https://nex-chat-app-ten.vercel.app/home`);
  }
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw ApiError.unauthorized("User not authenticated");
    }
    res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .json(new ApiResponse(200, {}, "User logged out from the session"));
  }
);

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = {
      _id: req.user?.id,
      username: req.user?.username,
      email: req.user?.email,
    };
    res
      .status(200)
      .json(new ApiResponse(200, { user }, "User fetched successfully"));
  }
);
