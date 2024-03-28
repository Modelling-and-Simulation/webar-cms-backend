import asyncHandler from "express-async-handler";
import SceneModel from "../../models/Scene.js";

const editScene = asyncHandler(async (req, res) => {
  const { sceneName, description } = req.body;
  const { id } = req.params;

  try {
    if (sceneName === undefined || sceneName === "") {
      res.status(400);
      throw new Error("Scene name is required");
    } else if (description === undefined || description === "") {
      res.status(400);
      throw new Error("Description is required");
    }

    const foundScene = await SceneModel.findOne({
      _id: id,
      author: req.user,
    });

    if (!foundScene) {
      res.status(404);
      throw new Error("Scene not found");
    }

    foundScene.sceneName = sceneName;
    foundScene.description = description;
    await foundScene.save();

    res.status(200);
    res.send({ msg: "Scene updated" });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId" || err.kind === "CastError") {
      res.status(404);
      throw new Error("Scene not found");
    }

    throw new Error(err.message);
  }
});

export default editScene;
