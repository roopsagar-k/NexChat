import express from "express";
import {
  createOrGetOnetoOneChat,
  getAllOnetoOneChats,
  deleteOnetoOneChat,
  createGroupChat,
  getAllGroupChats,
  getGroupChatById,
  updateGroupDetails,
  deleteGroupChat,
  addUsersToGroup,
  removeUsersFromGroup,
} from "../controllers/chat.controller";

const chatRouter = express.Router();

chatRouter
  .post("/one-to-one", createOrGetOnetoOneChat)
  .get("/one-to-one", getAllOnetoOneChats)
  .delete("/one-to-one/:id", deleteOnetoOneChat)
  .post("/group", createGroupChat)
  .get("/group", getAllGroupChats)
  .get("/group/:id", getGroupChatById)
  .put("/group/:id", updateGroupDetails)
  .delete("/group/:id", deleteGroupChat)
  .put("/group/:id/add-users", addUsersToGroup)
  .put("group/:id/remove-users", removeUsersFromGroup);

export default chatRouter;
