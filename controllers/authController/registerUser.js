import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import UserModel from "../../models/User.js";
import ROLES_LIST from "../../config/roles_list.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, phoneNumber, password, role } = req.body;

  if (!name || !username || !email || !phoneNumber || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // check if the username, email or phonenumber already exists
  const user = await UserModel.findOne({
    $or: [
      { username: username },
      { email: email },
      { phoneNumber: phoneNumber },
    ],
  });

  if (user && user.username === username) {
    res.status(409);
    throw new Error("Username already exists");
  } else if (user && user.email === email) {
    res.status(409);
    throw new Error("Email already exists");
  } else if (user && user.phoneNumber === phoneNumber) {
    res.status(409);
    throw new Error("Phone number already exists");
  }

  try {
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      role: role ? role : ROLES_LIST.RegisteredUser,
    });

    await newUser.save();
    res.status(201);
    res.send({ msg: "User added to the system" });
  } catch (err) {
    console.error(err.message);
    throw new Error("Server error");
  }
});

export default registerUser;
