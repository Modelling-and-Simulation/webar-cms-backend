import multer from "multer";
import { contentStorage } from "../../config/multerStorage.js";
import { ACCEPTED_CONTENT_FILE_TYPES, ACCEPTED_IMAGE_FILE_TYPES } from "../../constants.js";
import { validateFileExt } from "../../util/validate.js";

const contentUpload = multer({
  storage: contentStorage,
});

const validateContentFileUpload = (req, res, next) => {
  contentUpload.fields([
    { name: "contentImage", maxCount: 1 },
    { name: "contentFile", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      next(err);
    }
    const contentImage = req.files?.contentImage;
    const contentFile = req.files?.contentFile;

    try {
      if (!contentImage) {
        throw new Error("No image uploaded");
      } else if (!contentFile) {
        throw new Error("No content file uploaded");
      } else if (!validateFileExt(contentImage, ACCEPTED_IMAGE_FILE_TYPES)) {
        throw new Error("Invalid image type");
      } else if (!validateFileExt(contentFile, ACCEPTED_CONTENT_FILE_TYPES)) {
        throw new Error("Invalid content file type");
      }
    } catch (err) {
      // remove the files if an error occurs
      try {
        contentImage.forEach((file) =>
          contentStorage._removeFile(null, file, () => {})
        );
      } catch (err) {
        console.error("Remove content image - " + err);
      }
      try {
        contentFile.forEach((file) =>
          contentStorage._removeFile(null, file, () => {})
        );
      } catch (err) {
        console.error("Remove content file - " + err);
      }
      next(err);
    }

    next();
  });
};

export default validateContentFileUpload;
