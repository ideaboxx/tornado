const fs = require('fs')
const path = require('path')

const { getAuthClient, createFolder, uploadFile} = require('./driveLib')
const constants = require('./constants.json')

module.exports = async function(torrent){
    await getAuthClient()
    const sourcefolderPath = path.join(constants.downloadPath, torrent.name)

    if(fs.lstatSync(sourcefolderPath).isDirectory()) {
        let folder = await createFolder(constants.driveMediaFolder, torrent.name)
        console.log("folder created with id:", folder)
        const files = await fs.promises.readdir(sourcefolderPath);
        for( const file of files ) {
            const fromPath = path.join( sourcefolderPath, file );
            await uploadFile(folder.data.id, fromPath)
            console.log("file uploaded:", file)
        }
    } else {
        await uploadFile(constants.driveMediaFolder, sourcefolderPath)
        console.log("file uploaded:", sourcefolderPath)
    }

    return true;
}






