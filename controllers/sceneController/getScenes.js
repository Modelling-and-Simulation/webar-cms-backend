import asyncHandler from "express-async-handler";
import SceneModel from "../../models/Scene.js";
import UserModel from "../../models/User.js";

const getScenes = asyncHandler(async (req, res) => {
  let scenes = await SceneModel.find({
    author: req.user,
  });

  // populate targetId and contentId in targetsAndContents array with their respective documents
  scenes = await SceneModel.populate(scenes, {
    path: "targetsAndContents.target",
    select: "targetName description targetImage",
  });

  await SceneModel.populate(scenes, {
    path: "targetsAndContents.content",
    select: "contentName description contentType contentFile contentImage",
  });

  res.status(200).send(scenes);
});

const getSceneByUrl = asyncHandler(async (req, res) => {
  const authorUsername = req.params?.authorUsername;
  const sceneName = req.params?.sceneName;

  const authorExists = await UserModel.findOne({
    username: authorUsername,
  });

  if (!authorExists) {
    res.status(404);
    throw new Error("Scene not found");
  }

  const scene = await SceneModel.findOne({
    author: authorExists._id,
    sceneName: sceneName,
  }).select("-__v -_id");

  console.log(scene);
  if (scene) {
    // populate targetId and contentId in targetsAndContents array with their respective documents
    await scene.populate(
      "targetsAndContents.target",
      "targetName description targetImage"
    );
    await scene.populate(
      "targetsAndContents.content",
      "contentName description contentType contentFile contentImage"
    );

    res.status(200).send(scene);
  } else {
    res.status(404);
    throw new Error("Scene not found");
  }
});

export { getScenes, getSceneByUrl };
