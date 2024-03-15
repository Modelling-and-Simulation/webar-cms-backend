import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import {
  ACCESS_TOKEN_EXPIRY,
  COOKIE_EXPIRY,
  JWT_COOKIE_OPTIONS,
  REFRESH_TOKEN_EXPIRY,
} from "../../constants.js";
import UserModel from "../../models/User.js";
import { getRoleName } from "../../config/roles_list.js";

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", JWT_COOKIE_OPTIONS);

  const foundUser = await UserModel.findOne({ refreshToken });

  // detedt refresh token reuse
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403); // forbidden
        console.log("Attempted refresh token reuse detected");

        const hackedUser = await UserModel.findById(decoded.UserInfo.userId);

        hackedUser.refreshToken = [];
        await hackedUser.save();
      }
    );

    return res.sendStatus(403);
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (token) => token !== refreshToken
  );

  // evaluate the refresh token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        console.log("Expired refresh token");
        foundUser.refreshToken = [...newRefreshTokenArray];
        await foundUser.save();
      }

      if (err || foundUser._id.toString() !== decoded.UserInfo.userId) {
        return res.sendStatus(403);
      }

      // generate new access token
      const roleName = getRoleName(foundUser.role);
      
      const accessToken = jwt.sign(
        {
          UserInfo: {
            userId: decoded.UserInfo.userId,
            role: roleName,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
      );

      const newRefreshToken = jwt.sign(
        {
          UserInfo: {
            userId: decoded.UserInfo.userId,
            role: roleName,
          },
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
      );

      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      await foundUser.save();

      // creates a cookie with the jwt token
      res.cookie("jwt", newRefreshToken, {
        ...JWT_COOKIE_OPTIONS,
        maxAge: COOKIE_EXPIRY,
      });

      res.json({ accessToken, roleName });
    }
  );
});

export default handleRefreshToken;
