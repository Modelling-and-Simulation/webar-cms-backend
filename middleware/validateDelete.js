import asyncHandler from "express-async-handler";
import SceneModel from "../models/Scene.js";

const validateTargetDelete = asyncHandler(async (req, res, next) => {
  const targetId = req.params.id;
  const isConfirmed = req.body.isConfirmed;

  if (!targetId) {
    res.status(400);
    throw new Error("Target ID is required");
  }

  if (isConfirmed) {
    // get referenced scenes and delete them
    await SceneModel.deleteMany({
      "targetsAndContents.target": targetId,
    });

    next();
  } else {
    // check is the target is referenced in any scene. get only name
    const referencedScenes = await SceneModel.find({
      "targetsAndContents.target": targetId,
    }).select({ sceneName: 1 });

    if (referencedScenes.length > 0) {
      res.status(409);
      throw new Error("Target is referenced in some scenes")
    } else {
      next();
    }
  }
});

const validateContentDelete = asyncHandler(async (req, res, next) => {
  const contentId = req.params.id;
  const isConfirmed = req.body.isConfirmed;

  if (!contentId) {
    res.status(400);
    throw new Error("Content ID is required");
  }

  if (isConfirmed) {
    // get referenced scenes and delete them
    await SceneModel.deleteMany({
      "targetsAndContents.content": contentId,
    });

    next();
  } else {
    // check is the target is referenced in any scene. get only name
    const referencedScenes = await SceneModel.find({
      "targetsAndContents.content": contentId,
    }).select({ sceneName: 1 });

    if (referencedScenes.length > 0) {
      res.status(409);
      throw new Error("Content is referenced in some scenes")
    } else {
      next();
    }
  }
});

export { validateTargetDelete, validateContentDelete };
