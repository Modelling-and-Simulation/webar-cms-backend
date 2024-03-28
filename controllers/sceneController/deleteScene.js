import asyncHandler from "express-async-handler";
import SceneModel from "../../models/Scene.js";
import { mindFileStorage } from "../../config/multerStorage.js";

const deleteScene = asyncHandler(async (req, res) => {
  const sceneId = req.params.id;

  if (!sceneId) {
    res.status(400);
    throw new Error("Scene ID is required");
  }

  try {
    const foundScene = await SceneModel.findOneAndDelete({
      _id: sceneId,
      author: req.user,
    });

    if (!foundScene) {
      res.status(404);
      throw new Error("Scene not found");
    }

    // remove the files from the storage
    try {
        mindFileStorage._removeFile(
        null,
        { path: foundScene.mindFile },
        () => {}
      );
    } catch (err) {
      console.error("Remove scene image - " + err.message);
    }

    res.status(200);
    res.send({ msg: "Scene deleted" });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      res.status(400);
      throw new Error("Invalid scene ID");
    }

    throw new Error(err.message);
  }
});

export default deleteScene;
