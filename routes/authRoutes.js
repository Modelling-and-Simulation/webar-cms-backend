import express from "express";
import authUser from "../controllers/authController/authUser.js";
import registerUser from "../controllers/authController/registerUser.js";
import handleRefreshToken from "../controllers/authController/refreshToken.js";
import handleLogout from "../controllers/authController/logoutUser.js";

const authRoutes = express.Router();

authRoutes.post("/login", authUser);
authRoutes.post("/register", registerUser);
authRoutes.post("/refresh_token", handleRefreshToken);
authRoutes.post("/logout", handleLogout);

export default authRoutes;
