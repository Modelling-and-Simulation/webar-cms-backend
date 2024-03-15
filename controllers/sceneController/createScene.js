import asyncHandler from "express-async-handler";
import SceneModel from "../../models/Scene.js";
import { mindFileStorage } from "../../config/multerStorage.js";

const createScene = asyncHandler(async (req, res) => {
  const { sceneName, description, targetAndContents } = req.body;
  const files = req.files;
  const mindFile = files.mindFile[0];

  try {
    if (sceneName === undefined || sceneName === "") {
      res.status(400);
      throw new Error("Scene name is required");
    } else if (description === undefined || description === "") {
      res.status(400);
      throw new Error("Description is required");
    } else if (targetAndContents === undefined || targetAndContents.length === 0) {
      res.status(400);
      throw new Error("Targets and contents are required");
    }

    // conver to lower case and remove starting and ending spaces and replace spaces with '-'
    const formattedSceneName = sceneName
      .trim()
      .toLowerCase()
      .replace(/\s/g, "-");

    // sceneName cannot be duplicated for a user
    const foundScene = await SceneModel.findOne({
      sceneName: formattedSceneName,
      author: req.user,
    });

    if (foundScene) {
      res.status(409); // conflict
      throw new Error("Scene name already exists");
    }

    // save the data to the database
    const sceneData = {
      sceneName: formattedSceneName,
      description: description,
      mindFile: mindFile.path,
      targetAndContents: JSON.parse(targetAndContents), // targetAndContents is an array of target and content ids
      author: req.user,
    };

    const newScene = new SceneModel(sceneData);
    await newScene.save();

    res.status(201);
    res.send({ msg: "Scene added to the system" });
  } catch (err) {
    console.error(err.message);

    try {
      mindFile &&
        mindFile.path &&
        mindFileStorage._removeFile(null, mindFile, () => {});
    } catch (err) {
      console.error("Remove mind file - " + err);
    }

    throw new Error(err.message);
  }
});

export default createScene;
