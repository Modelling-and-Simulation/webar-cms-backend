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

    // remove starting and ending spaces and replace spaces with underscore
    const formattedContentName = contentName.trim().replace(/\s/g, "-");

    const contentData = {
      contentName: formattedContentName,
      contentType: contentFile.mimetype,
      contentImage: contentImage.path,
      contentFile: contentFile.path,
      description: description || "No description provided",
      author: req.user,
    };

    // save the data to the database
    try {
      const newContent = new ContentModel(contentData);
      await newContent.save();

      res.status(201);
      res.send({ msg: "Content added to the system" });
    } catch (err) {
      if (err.name === "MongoServerError" && err.code === 11000) {
        res.status(409); // conflict
        throw new Error("Content name already exists");
      } else {
        throw new Error(err);
      }
    }
  } catch (err) {
    console.error(err.message);

    // remove the files if an error occurs
    try {
      contentStorage._removeFile(null, contentFile, () => {});
    } catch (err) {
      console.error("Remove content file - " + err);
    }
    try {
      contentStorage._removeFile(null, contentImage, () => {});
    } catch (err) {
      console.error("Remove content image - " + err);
    }

    throw new Error(err.message);
  }
});

export default createContent;
