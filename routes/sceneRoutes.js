import express from "express";

const sceneRoute = express.Router();

// controllers
import createScene from "../controllers/sceneController/createScene.js";
import deleteScene from "../controllers/sceneController/deleteScene.js";
import editScene from "../controllers/sceneController/editScene.js";
import updateTransfromation from "../controllers/sceneController/updateTransformation.js";
import {
  getSceneById,
  getScenes,
  getScenesForTransformation,
} from "../controllers/sceneController/getScenes.js";

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

sceneRoute.get(
  "/for-transformation",
  verifyRoles(ROLES_LIST.Staff),
  getScenesForTransformation
);
sceneRoute.get("/:id", getSceneById);
sceneRoute.get("/", verifyRoles(ROLES_LIST.RegisteredUser), getScenes);

sceneRoute.delete("/:id", deleteScene);

sceneRoute.put("/:id", editScene);
sceneRoute.put("/transformation/:id", updateTransfromation);

export default sceneRoute;
