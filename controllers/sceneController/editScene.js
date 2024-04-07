import asyncHandler from "express-async-handler";
import SceneModel from "../../models/Scene.js";

const editSceneNameAndDescription = asyncHandler(async (req, res) => {
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

    // conver to lower case and remove starting and ending spaces and replace spaces with '-'
    const formattedSceneName = sceneName
      .trim()
      .toLowerCase()
      .replace(/\s/g, "-");

    foundScene.sceneName = formattedSceneName;
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

const editSceneAll = asyncHandler(async (req, res) => {
  const { sceneName, description, targetsAndContents } = req.body;
  const files = req.files;
  const mindFile = files.mindFile[0];
  const { id } = req.params;

  try {
    if (sceneName === undefined || sceneName === "") {
      res.status(400);
      throw new Error("Scene name is required");
    } else if (description === undefined || description === "") {
      res.status(400);
      throw new Error("Description is required");
    } else if (
      targetsAndContents === undefined ||
      targetsAndContents.length === 0
    ) {
      res.status(400);
      throw new Error("Targets and contents are required");
    }

    const foundScene = await SceneModel.findOne({
      _id: id,
      author: req.user,
    });

    if (!foundScene) {
      res.status(404);
      throw new Error("Scene not found");
    }

    // conver to lower case and remove starting and ending spaces and replace spaces with '-'
    const formattedSceneName = sceneName
      .trim()
      .toLowerCase()
      .replace(/\s/g, "-");

    const previousMindFilePath = foundScene.mindFile;

    foundScene.sceneName = formattedSceneName;
    foundScene.description = description;
    foundScene.mindFile = mindFile.path;
    foundScene.targetsAndContents = JSON.parse(targetsAndContents); // targetsAndContents is an array of target and content ids

    foundScene
      .save()
      .then(() => {
        // remove the previous mind file
        try {
          previousMindFilePath &&
            mindFileStorage._removeFile(
              null,
              { path: previousMindFilePath },
              () => {}
            );
        } catch (err) {
          console.error("Remove mind file - " + err);
        }

        res.status(200);
        res.send({ msg: "Scene updated" });
      })
      .catch((err) => {
        console.error(err.message);
        res.status(500);
        throw new Error("Internal server error");
      });
  } catch (err) {
    console.error(err.message);

    try {
      mindFile &&
        mindFile.path &&
        mindFileStorage._removeFile(null, mindFile, () => {});
    } catch (err) {
      console.error("Remove mind file - " + err);
    }

    if (err.kind === "ObjectId" || err.kind === "CastError") {
      res.status(404);
      throw new Error("Scene not found");
    }

    throw new Error(err.message);
  }
});

export { editSceneNameAndDescription, editSceneAll };
