import express from "express";

// controllers
import createTarget from "../controllers/targetController/createTarget.js";
import deleteTarget from "../controllers/targetController/deleteTarget.js";
import {
  getTargets,
  getTargetByName,
} from "../controllers/targetController/getTargets.js";

// middleware
import verifyRoles from "../middleware/verifyRoles.js";
import validateTargetImageupload from "../middleware/fileValidations/validateTargetImageupload.js";

import ROLES_LIST from "../config/roles_list.js";

const targetRoute = express.Router();

targetRoute.post(
  "/",
  verifyRoles(ROLES_LIST.RegisteredUser),
  validateTargetImageupload,
  createTarget
);

targetRoute.get("/", getTargets);

targetRoute.get("/:targetName", getTargetByName);

targetRoute.delete("/:id", deleteTarget);

export default targetRoute;
