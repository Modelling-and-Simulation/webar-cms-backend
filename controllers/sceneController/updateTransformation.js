import asyncHandler from "express-async-handler";
import SceneModel from "../../models/Scene.js";

const updateTransfromation = asyncHandler(async (req, res) => {
  const { position, rotation, scale, selectedIndex } = req.body;
  const { id } = req.params;

  try {
    if (
      id === undefined ||
      id === "" ||
      position === undefined ||
      position === "" ||
      rotation === undefined ||
      rotation === "" ||
      scale === undefined ||
      scale === "" ||
      selectedIndex === undefined ||
      selectedIndex === ""
    ) {
      res.status(400);
      throw new Error(
        "Scene id, position, rotation, scale and selected index are required"
      );
    }

    const foundScene = await SceneModel.findById(id);

    if (!foundScene) {
      res.status(404);
      throw new Error("Scene not found");
    }

    const { targetsAndContents } = foundScene;
    const target = targetsAndContents[selectedIndex];

    if (!target) {
      res.status(404);
      throw new Error("Target not found");
    }

    target.position = position;
    target.rotation = rotation;
    target.scale = scale;

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

export default updateTransfromation;
