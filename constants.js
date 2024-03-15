export const PARENT_DIR_FOR_TARGETS = "targets";
export const PARENT_DIR_FOR_CONTENTS = "contents";

export const TARGET_COLLECTION = process.env.USER + "_targets";
export const CONTENT_COLLECTION = process.env.USER + "_contents";
export const USER_COLLECTION = process.env.USER + "_users";
export const LINKING_COLLECTION = process.env.USER + "_linking";
export const SCENE_COLLECTION = process.env.USER + "_scenes";

export const IMAGE_FILE_NAME = "targetImage";
export const MIND_FILE_NAME = "mindFile";
export const MODEL_FILE_NAME = "model";

export const ACCEPTED_IMAGE_FILE_TYPES = ["png", "jpg", "jpeg", "webp"];
export const ACCEPTED_TARGET_FILE_TYPES = ["mind"];
export const ACCEPTED_CONTENT_FILE_TYPES = ["glb"];

export const ACCESS_TOKEN_EXPIRY = "15m";
export const REFRESH_TOKEN_EXPIRY = "7d";

export const JWT_COOKIE_NAME = "jwt";
export const JWT_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "None",
  secure: true,
};
export const COOKIE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
