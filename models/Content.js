import mongoose from "mongoose";
import { CONTENT_COLLECTION } from "../constants.js";

const Schema = mongoose.Schema;

const contentSchema = new Schema({
  contentName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "No description provided",
  },
  contentType: {
    type: String,
    required: true,
  },
  contentFile: {
    type: String,
    required: true,
  },
  previewFile: {
    type: String,
  },
  contentData: {
    type: Schema.Types.Mixed,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  author: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

contentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

contentSchema.pre("updateOne", function (next) {
  this.updatedAt = Date.now();
  next();
});

const ContentModel = mongoose.model(CONTENT_COLLECTION, contentSchema);

export default ContentModel;
