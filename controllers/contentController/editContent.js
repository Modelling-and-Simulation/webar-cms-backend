import asyncHandler from "express-async-handler";
import ContentModel from "../../models/Content.js";

const editContent = asyncHandler(async (req, res) => {
  const { contentName, description } = req.body;
  const { id } = req.params;

  try {
    if (contentName === undefined || contentName === "") {
      res.status(400);
      throw new Error("Content name is required");
    } else if (description === undefined || description === "") {
      res.status(400);
      throw new Error("Description is required");
    }

    const foundContent = await ContentModel.findOne({
      _id: id,
      author: req.user,
    });

    if (!foundContent) {
      res.status(404);
      throw new Error("Content not found");
    }

    foundContent.contentName = contentName;
    foundContent.description = description;
    await foundContent.save();

    res.status(200);
    res.send({ msg: "Content updated" });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId" || err.kind === "CastError") {
      res.status(404);
      throw new Error("Content not found");
    }

    throw new Error(err.message);
  }
});

export default editContent;
