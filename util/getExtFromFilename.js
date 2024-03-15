const getExtFromFilename = (filename) => {
  const ext = filename.split(".").pop();
  return "." + ext;
};

export default getExtFromFilename;
