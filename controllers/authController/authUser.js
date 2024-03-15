import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserModel from "../../models/User.js";
import {
  ACCESS_TOKEN_EXPIRY,
  COOKIE_EXPIRY,
  JWT_COOKIE_NAME,
  JWT_COOKIE_OPTIONS,
  REFRESH_TOKEN_EXPIRY,
} from "../../constants.js";
import { getRoleName } from "../../config/roles_list.js";

const authUser = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  console.log(`cookie available at login: ${JSON.stringify(cookies)}`);

  const { username, password } = req.body;

  if (!username) {
    res.status(400);
    throw new Error("Username is required");
  } else if (!password) {
    res.status(400);
    throw new Error("Password is required");
  }

  const user = await UserModel.findOne({
    username: username,
  });

  if (!user) {
    res.status(401); // Unauthorized
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid password");
  }

  // get the role name from the value
  const roleName = getRoleName(user.role);

  const payload = {
    UserInfo: {
      userId: user._id.toString(),
      role: roleName,
    },
  };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const newRefreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  let newRefreshTokenArray = !cookies?.jwt
    ? user.refreshToken
    : user.refreshToken.filter((token) => token !== cookies.jwt);

  if (cookies?.jwt) {
    const refreshToken = cookies.jwt;
    const foundToken = await UserModel.findOne({
      refreshToken,
    }).exec();

    // Detect refresh token reuse
    if (!foundToken) {
      console.log("Attempted refresh token reuse detected");

      // clear the refresh token
      newRefreshTokenArray = [];
    }

    res.clearCookie(JWT_COOKIE_NAME, JWT_COOKIE_OPTIONS);
  }

  // saving the new refresh token
  user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
  const result = await user.save();

  // create secure and httpOnly cookie
  res.cookie(JWT_COOKIE_NAME, newRefreshToken, {
    ...JWT_COOKIE_OPTIONS,
    maxAge: COOKIE_EXPIRY,
  });

  res.status(200);
  res.send({ roleName, accessToken, name: user.name });
});

export default authUser;
