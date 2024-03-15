import asyncHandler from "express-async-handler";
import SceneModel from "../../models/Scene.js";

const getScenes = asyncHandler(async (req, res) => {
  const scenes = await SceneModel.find({
    author: req.user,
  });

  res.status(200).send(scenes);
});

export { getScenes };
