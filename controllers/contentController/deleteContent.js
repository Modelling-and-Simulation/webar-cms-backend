import asyncHandler from "express-async-handler";
import ContentModel from "../../models/Content.js";
import { contentStorage } from "../../config/multerStorage.js";

const deleteContent = asyncHandler(async (req, res) => {
  const contentId = req.params.id;

  if (!contentId) {
    res.status(400);
    throw new Error("Content ID is required");
  }

  try {
    const foundContent = await ContentModel.findByIdAndDelete(contentId);

    if (!foundContent) {
      res.status(404);
      throw new Error("Content not found");
    }

    // remove the files from the storage
    try {
      contentStorage._removeFile(
        null,
        { path: foundContent.contentImage },
        () => {}
      );
    } catch (err) {
      console.error("Remove content image - " + err.message);
    }

    try {
      contentStorage._removeFile(
        null,
        { path: foundContent.contentFile },
        () => {}
      );
    } catch (err) {
      console.error("Remove content file - " + err.message);
    }

    res.status(200);
    res.send({ msg: "Content deleted" });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      res.status(400);
      throw new Error("Invalid content ID");
    }

    throw new Error("Internal server error");
  }
});

export default deleteContent;
