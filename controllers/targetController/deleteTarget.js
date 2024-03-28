import asyncHandler from "express-async-handler";
import TargetModel from "../../models/Target.js";
import { targetStorage } from "../../config/multerStorage.js";

const deleteTarget = asyncHandler(async (req, res) => {
  const targetId = req.params.id;

  if (!targetId) {
    res.status(400);
    throw new Error("Target ID is required");
  }

  try {
    const foundTarget = await TargetModel.findOneAndDelete({
      _id: targetId,
      author: req.user,
    })
    
    if (!foundTarget) {
      res.status(404);
      throw new Error("Target not found");
    }

    // remove the files from the storage
    try {
      targetStorage._removeFile(
        null,
        { path: foundTarget.targetImage },
        () => {}
      );
    } catch (err) {
      console.error("Remove target image - " + err.message);
    }

    res.status(200);
    res.send({ msg: "Target deleted" });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      res.status(400);
      throw new Error("Invalid target ID");
    }

    throw new Error(err.message);
  }
});

export default deleteTarget;
