import multer from "multer";

import getRandomFileName from "../util/getRandomFIlename.js";
import getExtFromFilename from "../util/getExtFromFilename.js";

const targetStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/targetImages/");
  },
  filename: function (req, file, cb) {
    cb(null, getRandomFileName() + getExtFromFilename(file.originalname));
  },
});

const mindFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/mindFiles/");
  },
  filename: function (req, file, cb) {
    cb(null, getRandomFileName() + getExtFromFilename(file.originalname));
  },
});

const contentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname == "contentImage") cb(null, "./public/contentImages/");
    else if (file.fieldname == "contentFile") cb(null, "./public/contentFiles/");
  },
  filename: function (req, file, cb) {
    cb(null, getRandomFileName() + getExtFromFilename(file.originalname));
  },
});

export { targetStorage, mindFileStorage, contentStorage };
