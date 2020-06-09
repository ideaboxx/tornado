const fs = require('fs')
const path = require('path')

const { getAuthClient, createFolder, uploadFile} = require('./driveLib')
const constants = require('./constants.json')

async function uploadFolder(srcPath, folderId=constants.driveMediaFolder) {
    if(fs.lstatSync(srcPath).isDirectory()) {
        const folderName = srcPath.split(path.sep).pop()
        let folder = await createFolder(folderId, folderName)
        const items = await fs.promises.readdir(srcPath);
        for(const item of items) {
            const itemPath = path.join(srcPath, item);
            if(fs.lstatSync(itemPath).isDirectory())
                await uploadFolder(itemPath, folder.data.id)
            else
                await uploadFile(folder.data.id, itemPath)
        }
    } else {
        await uploadFile(folderId, srcPath)
    }
}


module.exports = async function(torrent){
    await getAuthClient()
    const sourcefolderPath = path.join(constants.downloadPath, torrent.name)
    uploadFolder(sourcefolderPath)
    return true;
}






