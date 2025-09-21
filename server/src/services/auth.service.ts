import ApiError from "../utils/api-error.utils";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { JWT } from "./jwt.service";

export class AuthService {
  private static SALT_ROUND = 10;

  static async registerUser(username: string, password: string, email: string) {
    const validEmail = this.validateEmail(email);
    if (!validEmail) {
      ApiError.badRequest("Email not valid, Please enter proper email.");
    }

    const user = await User.findOne({ email });
    if (user) {
      ApiError.conflict("User already exists with the provided email.");
    }

    const newUser = await User.create({
      username,
      email,
      password,
    });

    return newUser;
  }

  static async loginUser(email: string, password: string) {

    console.log("login route hit")
    const validEmail = this.validateEmail(email);
    if (!validEmail) {
      throw ApiError.badRequest("Enter the proper email to login.");
    }

    const user = await User.findOne({ email }).select("+password");

    console.log("user got", user)
    if (!user) {
      throw ApiError.notFound(
        "User not found, Please try again with a proper email."
      );
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      throw ApiError.unauthorized("Password mismatch.");
    }

    console.log("user log", user)

    const token = JWT.generateToken({
      id: user._id,
      username: user.username,
      email: user.email,
    });
    return token;
  }

  private static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
