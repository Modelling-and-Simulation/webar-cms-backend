import asyncHandler from "express-async-handler";
import TargetModel from "../../models/Target.js";
import { targetStorage } from "../../config/multerStorage.js";

const createTarget = asyncHandler(async (req, res) => {
  const files = req.files;
  const { targetName, description } = req.body;
  const targetImage = files.targetImage[0];

  try {
    if (targetName === undefined || targetName === "") {
      res.status(400);
      throw new Error("Target name is required");
    } else if (description === undefined || description === "") {
      res.status(400);
      throw new Error("Description is required");
    }

    // targetName cannot be duplicated for a user
    const foundTarget = await TargetModel.findOne({
      targetName: targetName.trim(),
      author: req.user,
    });

    if (foundTarget) {
      res.status(409); // conflict
      throw new Error("Target name already exists");
    }

    // save the data to the database
    const targetData = {
      targetName: targetName.trim(),
      description: description,
      targetImage: targetImage.path,
      author: req.user,
    };

    const newTarget = new TargetModel(targetData);
    await newTarget.save();

    res.status(201);
    res.send({ msg: "Target added to the system" });
  } catch (err) {
    console.error(err.message);

    try {
      targetImage &&
        targetImage.path &&
        targetStorage._removeFile(null, targetImage, () => {});
    } catch (err) {
      console.error("Remove target image - " + err);
    }

    throw new Error(err.message);
  }
});

export default createTarget;
