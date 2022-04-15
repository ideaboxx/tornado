const GdriveFS = require("@ideabox/cloud-drive-fs").default;
const fs = require("fs");
const path = require("path");

const uploadFile = async (filepath, name, folderId, g) => {
  try {
    await g.uploadFile(fs.createReadStream(filepath), {
      name: name,
      size: fs.statSync(filepath).size,
      parentId: folderId,
    });
  } catch (e) {
    console.log(e);
  }
};

const uploadFolder = async (rootPath, parentId, g) => {
  console.log("Uploading:", rootPath);
  try {
    if (fs.lstatSync(rootPath).isDirectory()) {
      const dirname = path.basename(rootPath);
      const folder = await g.createFolder(dirname, parentId);
      for (const file of fs.readdirSync(rootPath)) {
        console.log("->", file);
        const filepath = path.join(rootPath, file);
        if (fs.lstatSync(filepath).isDirectory()) {
          await uploadFolder(filepath, folder.id);
        } else {
          await uploadFile(filepath, file, folder.id, g);
        }
      }
    } else {
      const filename = path.basename(rootPath);
      await uploadFile(rootPath, filename, parentId, g);
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
