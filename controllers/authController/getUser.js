import asyncHandler from "express-async-handler";
import UserModel from "../../models/User.js";

const getProfile = asyncHandler(async (req, res) => {
  // get name and email from the user object in db
  const user = await UserModel.findById(req.user).select(
    "name username email phoneNumber role createdAt updatedAt"
  );
  res.status(200).send(user);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id).select(
    "-password -refreshToken"
  );
  res.status(200).send(user);
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find().select("-password -refreshToken");
  res.status(200).send(users);
});

export { getProfile, getUserById, getAllUsers };
