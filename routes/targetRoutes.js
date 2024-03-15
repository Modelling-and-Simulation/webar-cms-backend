import express from "express";

// controllers
import createTarget from "../controllers/targetController/createTarget.js";
import getAllTargets from "../controllers/targetController/getAllTargets.js";
import getTargetByName from "../controllers/targetController/getTargetByName.js";

// middleware
import verifyRoles from "../middleware/verifyRoles.js";
import validateTargetImageupload from "../middleware/fileValidations/validateTargetImageupload.js";

import ROLES_LIST from "../config/roles_list.js";

const targetRoute = express.Router();

targetRoute.post(
  "/",
  verifyRoles(ROLES_LIST.Customer),
  validateTargetImageupload,
  createTarget
);

targetRoute.get("/", getAllTargets);

targetRoute.get("/:targetName", getTargetByName);

export default targetRoute;
