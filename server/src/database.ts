import mongoose from "mongoose";
import { ENV } from "./config";

const connectDB = async () => {
    const mongoUri = ENV.MONGO_URI;
    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to database!");
    } catch (error) {
        console.error("Mongodb connection error", error);
        process.exit(1);
    }
}

export default connectDB;