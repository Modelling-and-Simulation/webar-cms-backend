import asyncHandler from "express-async-handler";
import TargetModel from "../../models/Target.js";

const editTarget = asyncHandler(async (req, res) => {
  const { targetName, description } = req.body;
  const { id } = req.params;

  try {
    if (targetName === undefined || targetName === "") {
      res.status(400);
      throw new Error("Target name is required");
    } else if (description === undefined || description === "") {
      res.status(400);
      throw new Error("Description is required");
    }

    const foundTarget = await TargetModel.findOne({
      _id: id,
      author: req.user,
    });

    if (!foundTarget) {
      res.status(404);
      throw new Error("Target not found");
    }

    foundTarget.targetName = targetName;
    foundTarget.description = description;
    await foundTarget.save();

    res.status(200);
    res.send({ msg: "Target updated" });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId" || err.kind === "CastError") {
      res.status(404);
      throw new Error("Target not found");
    }

    throw new Error(err.message);
  }
});

export default editTarget;
