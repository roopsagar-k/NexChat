import mongoose, { Document, Types } from "mongoose";

interface IChat extends Document {
  _id: Types.ObjectId;
  isGroup: boolean;
  name: string;
  members: Types.ObjectId[];
  groupAdmin?: Types.ObjectId;
  lastSeenMessage?: Types.ObjectId;
}

const chatSchema = new mongoose.Schema<IChat>(
  {
    isGroup: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
    },
    members: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    groupAdmin: {
      type: Types.ObjectId,
      ref: "User",
    },
    lastSeenMessage: {
      type: Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model<IChat>("Chat", chatSchema);
export default Chat;
