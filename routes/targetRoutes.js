import express from "express";

// controllers
import createTarget from "../controllers/targetController/createTarget.js";
import deleteTarget from "../controllers/targetController/deleteTarget.js";
import editTarget from "../controllers/targetController/editTarget.js";
import {
  getTargets,
  getTargetByName,
} from "../controllers/targetController/getTargets.js";

// middleware
import verifyRoles from "../middleware/verifyRoles.js";
import validateTargetImageupload from "../middleware/fileValidations/validateTargetImageupload.js";
import { validateTargetDelete } from "../middleware/validateDelete.js";

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

targetRoute.delete("/:id", validateTargetDelete, deleteTarget);

targetRoute.put("/:id", editTarget);

export default targetRoute;
