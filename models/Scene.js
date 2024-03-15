import mongoose from "mongoose";
import {
  CONTENT_COLLECTION,
  SCENE_COLLECTION,
  TARGET_COLLECTION,
  USER_COLLECTION,
} from "../constants.js";

const Schema = mongoose.Schema;

const sceneSchema = new Schema({
  sceneName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "No description provided",
  },
  mindFile: {
    type: String,
    required: true,
  },
  targetsAndContents: {
    type: [
      {
        target: {
          type: Schema.Types.ObjectId,
          ref: TARGET_COLLECTION,
          required: true,
        },
        content: {
          type: Schema.Types.ObjectId,
          ref: CONTENT_COLLECTION,
          required: true,
        },
        position: {
          x: {
            type: Number,
            default: 0,
          },
          y: {
            type: Number,
            default: 0,
          },
          z: {
            type: Number,
            default: 0,
          },
        },
        rotation: {
          x: {
            type: Number,
            default: 0,
          },
          y: {
            type: Number,
            default: 0,
          },
          z: {
            type: Number,
            default: 0,
          },
        },
        scale: {
          type: Number,
          default: 1,
        },
        editedByStaff: String,
        confirmedByStaffAt: Date,
      },
    ],
    default: [],
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: USER_COLLECTION,
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

sceneSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

sceneSchema.pre("updateOne", function (next) {
  this.updatedAt = Date.now();
  next();
});

const SceneModel = mongoose.model(SCENE_COLLECTION, sceneSchema);

export default SceneModel;
