import express from "express";
import {
  getSignedUrlForPutAccess,
  getSignedUrlForGetAccess,
} from "../controllers/storage.controller";

const storageRouter = express.Router();

storageRouter
  .get("/signed-url/get", getSignedUrlForGetAccess)
  .get("/signed-url/put", getSignedUrlForPutAccess);

export default storageRouter;
