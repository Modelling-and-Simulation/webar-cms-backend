export const validateFileExt = (file, extList) => {
  try {
    // if file is an array, check each file
    if (Array.isArray(file)) {
      return file.every((f) => {
        const fileExt = f.originalname.split(".").pop();
        return extList.includes(fileExt);
      });
    }

    // if file is not an array, check the single file
    const fileExt = file.originalname.split(".").pop();
    return extList.includes(fileExt);
  } catch (err) {
    console.error("Error in validateFileExt: " + err);
    return false;
  }
};
