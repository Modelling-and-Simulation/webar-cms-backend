import asyncHandler from "express-async-handler";
import SceneModel from "../../models/Scene.js";
import UserModel from "../../models/User.js";

function getPopulateOptions() {
  return [
    {
      path: "targetsAndContents.target",
      select: "targetName description targetImage",
    },
    {
      path: "targetsAndContents.content",
      select: "contentName description contentType contentFile contentImage",
    },
  ];
}

const getScenes = asyncHandler(async (req, res) => {
  // populate targetId and contentId in targetsAndContents array with their respective documents
  let scenes = await SceneModel.find({
    author: req.user,
  }).populate(getPopulateOptions());

  res.status(200).send(scenes);
});

const getScenesForTransformation = asyncHandler(async (req, res) => {
  // populate targetId and contentId in targetsAndContents array with their respective documents
  let scenes = await SceneModel.find({
    targetsAndContents: { $elemMatch: { isTransformed: false } },
  }).populate(getPopulateOptions());

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
  });

  if (scene) {
    // populate targetId and contentId in targetsAndContents array with their respective documents
    await scene.populate(getPopulateOptions());

    // increase scene views
    try {
      await SceneModel.updateOne({ _id: scene._id }, { $inc: { views: 1 } });
    } catch (error) {
      console.log("Error in increasing views", error.message);
    }

    res.status(200).send(scene);
  } else {
    res.status(404);
    throw new Error("Scene not found");
  }
});

const getSceneById = asyncHandler(async (req, res) => {
  // populate targetId and contentId in targetsAndContents array with their respective documents
  try {
    const scene = await SceneModel.findById(req.params.id).populate(
      getPopulateOptions()
    );

    if (scene) {
      res.status(200).send(scene);
    } else {
      res.status(404);
      throw new Error("Scene not found");
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(404);
      throw new Error("Scene not found");
    }
  }
});

export { getScenes, getScenesForTransformation, getSceneByUrl, getSceneById };
