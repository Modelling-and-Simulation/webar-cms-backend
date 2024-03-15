import asyncHandler from "express-async-handler";
import ContentModel from "../../models/Content.js";

const getAllContents = asyncHandler(async (req, res) => {
  const contents = await ContentModel.find();
  res.status(200).send(contents);
});

export default getAllContents;
