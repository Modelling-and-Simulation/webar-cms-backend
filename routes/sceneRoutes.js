import express from "express";

const sceneRoute = express.Router();

// controllers
import createScene from "../controllers/sceneController/createScene.js";
import deleteScene from "../controllers/sceneController/deleteScene.js";
import editScene from "../controllers/sceneController/editScene.js";
import { getScenes } from "../controllers/sceneController/getScenes.js";

// middleware
import verifyRoles from "../middleware/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";
import validateMindFileUpload from "../middleware/fileValidations/validateMindFileUpload.js";

sceneRoute.post(
  "/",
  verifyRoles(ROLES_LIST.RegisteredUser),
  validateMindFileUpload,
  createScene
);

sceneRoute.get("/", getScenes);

sceneRoute.delete("/:id", deleteScene);

sceneRoute.put("/:id", editScene);

export default sceneRoute;
