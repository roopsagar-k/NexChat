import express from 'express';
import { getMessages } from '../controllers/message.controller';

const messageRouter = express.Router();

messageRouter.get("/:chatId", getMessages);

export default messageRouter;