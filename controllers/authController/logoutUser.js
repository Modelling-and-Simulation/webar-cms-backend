import asyncHandler from "express-async-handler";
import { JWT_COOKIE_NAME, JWT_COOKIE_OPTIONS } from "../../constants.js";
import UserModel from "../../models/User.js";

const handleLogout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await UserModel.findOne({ refreshToken });
  if (!foundUser) {
    res.clearCookie(JWT_COOKIE_NAME, JWT_COOKIE_OPTIONS);
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );
  const result = await foundUser.save();

  res.clearCookie(JWT_COOKIE_NAME, JWT_COOKIE_OPTIONS);
  res.sendStatus(204);
});

export default handleLogout;
