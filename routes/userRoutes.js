import express from "express";

// controllers
import {
  getAllUsers,
  getProfile,
  getUserById,
} from "../controllers/authController/getUser.js";
import makeStaffUser from "../controllers/authController/makeStaffUser.js";
import registerUser from "../controllers/authController/registerUser.js";

// middleware
import verifyRoles from "../middleware/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";

const userRoutes = express.Router();

userRoutes.post(
  "/registerStaff",
  // verifyRoles(ROLES_LIST.Admin),
  makeStaffUser,
  registerUser
);

userRoutes.get("/profile", verifyRoles(ROLES_LIST.RegisteredUser), getProfile);
userRoutes.get("/:id", verifyRoles(ROLES_LIST.Admin), getUserById);
userRoutes.get("/", verifyRoles(ROLES_LIST.Admin), getAllUsers);

export default userRoutes;
