import multer from "multer";
import { mindFileStorage } from "../../config/multerStorage.js";
import { ACCEPTED_TARGET_FILE_TYPES } from "../../constants.js";
import { validateFileExt } from "../../util/validate.js";

const mindFileUpload = multer({
  storage: mindFileStorage,
});

const validateMindFileUpload = (req, res, next) => {
  mindFileUpload.fields([{ name: "mindFile", maxCount: 1 }])(
    req,
    res,
    (err) => {
      const mindFile = req.files?.mindFile;

      try {
        if (err) {
          throw new Error("Error in mind file upload: " + err.message);
        }
        if (!mindFile) {
          throw new Error("No file uploaded");
        } else if (!validateFileExt(mindFile, ACCEPTED_TARGET_FILE_TYPES)) {
          throw new Error("Invalid file type");
        }
      } catch (err) {
        res.status(400);
        console.error(err.message);
        // remove the files if an error occurs
        try {
          mindFile.forEach((file) =>
            mindFileStorage._removeFile(null, file, () => {})
          );
        } catch (err) {
          console.error("Remove mind files - " + err);
        }

        next(err);
      }

      next();
    }
  );
};

export default validateMindFileUpload;
