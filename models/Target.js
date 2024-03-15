import mongoose from "mongoose";
import { TARGET_COLLECTION } from "../constants.js";

const Schema = mongoose.Schema;

const targetSchema = new Schema({
  targetName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "No description provided",
  },
  targetImage: {
    type: String,
    required: true,
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

targetSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

targetSchema.pre("updateOne", function (next) {
  this.updatedAt = Date.now();
  next();
});

const TargetModel = mongoose.model(TARGET_COLLECTION, targetSchema);

export default TargetModel;
