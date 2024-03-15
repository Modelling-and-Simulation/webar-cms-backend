const getRandomFileName = () => {
  return Date.now().toString() + Math.floor(Math.random() * 1e9);
};

export default getRandomFileName;
