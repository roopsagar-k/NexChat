import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/myapp",
  JWT_SECRET: (process.env.JWT_SECRET || "").toString(),
  CLIENT_URL: process.env.CLIENT_URL,
  R2_ACC_ID: process.env.R2_ACC_ID,
  R2_ACCESS_KEY: process.env.R2_ACCESS_KEY,
  R2_SECRET: process.env.R2_SECRET,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  BACKEND_URL: (process.env.BACKEND_URL || "").toString(),
  CDN_URL: (process.env.CDN_URL || "").toString(),
  NODE_ENV: (process.env.NODE_ENV || "development").toString(),
};
