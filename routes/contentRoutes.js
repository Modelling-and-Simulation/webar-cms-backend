import express from "express";

// controllers
import createContent from "../controllers/contentController/createContent.js";
import deleteContent from "../controllers/contentController/deleteContent.js";
import editContent from "../controllers/contentController/editContent.js";
import { getContents } from "../controllers/contentController/getContents.js";

import validateContentFileUpload from "../middleware/fileValidations/validateContentFileUpload.js";

const contentRoute = express.Router();

contentRoute.post(
  "/",
  validateContentFileUpload,
  createContent
);

contentRoute.get("/", getContents);

contentRoute.delete("/:id", deleteContent);

contentRoute.put("/:id", editContent);

export default contentRoute;
