const { generateRandomString } = require("./utils");
const basePath = "/uploads";

const uploadFile = async (pathPrefix, file) => {
  const fileName = file.originalname;
  const randomString = generateRandomString(20);
  fileName = basePath + pathPrefix + randomString + "_" + fileName;

  // appending a 20 bytes random string plus a _ to the beginning of filename to prevent collisions of same file names
  const filePath = path.join(__dirname, fileName);

  try {
    await fs.writeFileSync(filePath, fileBuffer);
    return fileName;
  } catch (error) {
    throw ("Error writing the file:", error.message);
  }
};

const uploadCV = async (file) => {
  return uploadFile("/CVs", file);
};
const readFile = async (filePath) => {
  try {
    const fileFullPath = path.join(__dirname, filePath);

    const fileContent = await fs.promises.readFile(fileFullPath);
    return fileContent;
  } catch (error) {
    throw new Error("Error reading the file: " + error.message);
  }
};
module.exports = { uploadCV, uploadFile, readFile };
