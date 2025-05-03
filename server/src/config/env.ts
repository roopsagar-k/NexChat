import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/myapp",
  JWT_SECRET: (process.env.JWT_SECRET || "").toString(),
  CLIENT_URL: process.env.CLIENT_URL,
};
