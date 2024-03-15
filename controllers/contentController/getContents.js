import asyncHandler from "express-async-handler";
import ContentModel from "../../models/Content.js";

const getContents = asyncHandler(async (req, res) => {
  const contents = await ContentModel.find({
    author: req.user,
  });
  res.status(200).send(contents);
});

export { getContents };
