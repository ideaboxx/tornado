const GdriveFS = require("@ideabox/cloud-drive-fs").default;
const fs = require("fs");
const path = require("path");

module.exports = async (key, rootPath) => {
  const g = new GdriveFS({ key: key });

  const list = await g.getFilesAndFolders();
  const filteredList = list.filter((item) => item.name === "tornedo-downloads");

  let tornedoFolder = {};
  if (!filteredList || filteredList.length === 0) {
    console.log("-> Creating tornedo-downloads folder");
    tornedoFolder = await g.createFolder("tornedo-downloads");
  } else {
    tornedoFolder = filteredList[0];
  }

  const uploadFolder = async (rootPath, parentId) => {
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

  await uploadFolder(rootPath, tornedoFolder.id);
};
