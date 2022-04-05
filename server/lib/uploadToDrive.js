const GdriveFS = require("@ideabox/cloud-drive-fs").default;
const fs = require("fs");
const path = require("path");

const uploadFolder = async (rootPath, parentId, g) => {
  console.log("Uploading:", rootPath);
  const dirname = path.basename(rootPath);
  try {
    const folder = await g.createFolder(dirname, parentId);
    for (const file of fs.readdirSync(rootPath)) {
      console.log("->", file);
      const filepath = path.join(rootPath, file);
      if (fs.lstatSync(filepath).isDirectory()) {
        await uploadFolder(filepath, folder.id);
      } else {
        try {
          await g.uploadFile(fs.createReadStream(filepath), {
            name: file,
            size: fs.statSync(filepath).size,
            parentId: folder.id,
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = async (key, rootPath) => {
  const g = new GdriveFS({ key: key });
  const folderName = "tornedo-downloads";
  const torrFolder = (await g.list()).filter((f) => f.name === folderName)[0];
  await uploadFolder(rootPath, torrFolder.id, g);
};
