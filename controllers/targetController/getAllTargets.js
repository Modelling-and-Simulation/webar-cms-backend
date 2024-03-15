import asyncHandler from "express-async-handler";
import TargetModel from "../../models/Target.js";

const getAllTargets = asyncHandler(async (req, res) => {
  const targets = await TargetModel.find();
  res.status(200).send(targets);
});

export default getAllTargets;
