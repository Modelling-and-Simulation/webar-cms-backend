import multer from "multer";
import { targetStorage } from "../../config/multerStorage.js";
import { ACCEPTED_IMAGE_FILE_TYPES } from "../../constants.js";
import { validateFileExt } from "../../util/validate.js";

const targetUpload = multer({
  storage: targetStorage,
});

const validateTargetImageupload = (req, res, next) => {
  targetUpload.fields([{ name: "targetImage", maxCount: 1 }])(
    req,
    res,
    (err) => {
      const targetImage = req.files?.targetImage;

      try {
        if (err) {
          throw new Error("Error in target upload: " + err.message);
        }
        if (!targetImage) {
          throw new Error("No image uploaded");
        } else if (!validateFileExt(targetImage, ACCEPTED_IMAGE_FILE_TYPES)) {
          throw new Error("Invalid image type");
        }
      } catch (err) {
        res.status(400);
        console.error(err.message);
        // remove the files if an error occurs
        try {
          targetImage.forEach((file) =>
            targetStorage._removeFile(null, file, () => {})
          );
        } catch (err) {
          console.error("Remove target images - " + err);
        }

        next(err);
      }

      next();
    }
  );
};

export default validateTargetImageupload;
