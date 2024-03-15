import express from "express";

const sceneRoute = express.Router();

// controllers
import createScene from "../controllers/sceneController/createScene.js";

// middleware
import verifyRoles from "../middleware/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";
import validateMindFileUpload from "../middleware/fileValidations/validateMindFileUpload.js";
import { getScenes } from "../controllers/sceneController/getScenes.js";

sceneRoute.post(
  "/",
  verifyRoles(ROLES_LIST.Customer),
  validateMindFileUpload,
  createScene
);

sceneRoute.get("/", getScenes);

export default sceneRoute;