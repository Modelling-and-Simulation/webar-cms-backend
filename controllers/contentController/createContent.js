import asyncHandler from "express-async-handler";
import ContentModel from "../../models/Content.js";
import { contentStorage } from "../../config/multerStorage.js";

const createContent = asyncHandler(async (req, res) => {
  const files = req.files;
  const { description, contentName } = req.body;
  const contentImage = files.contentImage[0];
  const contentFile = files.contentFile[0];

  try {
    if (contentName === undefined || contentName === "") {
      res.status(400);
      throw new Error("Content name is required");
    } else if (description === undefined || description === "") {
      res.status(400);
      throw new Error("Description is required");
    }

    // contentName cannot be duplicated for a user
    const foundContent = await ContentModel.findOne({
      contentName: contentName.trim(),
      author: req.user,
    });

    if (foundContent) {
      res.status(409); // conflict
      throw new Error("Content name already exists");
    }

    // save the data to the database
    const contentData = {
      contentName: contentName.trim(),
      contentType: contentFile.mimetype,
      contentImage: contentImage.path,
      contentFile: contentFile.path,
      description: description || "No description provided",
      author: req.user,
    };

    const newContent = new ContentModel(contentData);
    await newContent.save();

    res.status(201);
    res.send({ msg: "Content added to the system" });
  } catch (err) {
    console.error(err.message);

    // remove the files if an error occurs
    try {
      contentFile &&
        contentFile.path &&
        contentStorage._removeFile(null, contentFile, () => {});
    } catch (err) {
      console.error("Remove content file - " + err);
    }
    try {
      contentImage &&
        contentImage.path &&
        contentStorage._removeFile(null, contentImage, () => {});
    } catch (err) {
      console.error("Remove content image - " + err);
    }

    throw new Error(err.message);
  }
});

export default createContent;
