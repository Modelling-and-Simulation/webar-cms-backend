import asyncHandler from "express-async-handler";
import TargetModel from "../../models/Target.js";

const getTargetByName = asyncHandler(async (req, res) => {
  const targetName = req.params.targetName;
  const target = await TargetModel.findOne({ targetName: targetName }).select(
    "-__v -_id"
  );
  if (target) {
    res.status(200).send(target);
  } else {
    res.status(404);
    throw new Error("Target not found");
  }
});

export default getTargetByName;
