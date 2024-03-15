import express from "express";
import authUser from "../controllers/authController/authUser.js";
import registerUser from "../controllers/authController/registerUser.js";
import handleRefreshToken from "../controllers/authController/refreshToken.js";

const authRoutes = express.Router();

authRoutes.post("/login", authUser);
authRoutes.post("/register", registerUser);
authRoutes.post("/refresh_token", handleRefreshToken);

export default authRoutes;
