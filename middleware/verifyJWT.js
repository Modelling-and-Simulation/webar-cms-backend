import jwt from "jsonwebtoken";
import { getRoleValue } from "../config/roles_list.js";

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err.message);
      return res.sendStatus(403); //invalid token
    }
    req.user = decoded.UserInfo.userId;
    req.role = getRoleValue(decoded.UserInfo.role);
    next();
  });
};

export default verifyJWT;
