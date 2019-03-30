const fs = require('fs')
const path = require('path')
const { google } = require('googleapis')
const drive = google.drive('v3')
const drivelib = require('./lib/driveLib')
const constants = require('./constants')

let mediaFolder = constants.driveMediaFolder

async function uploadObject(auth, objectPath, parentFolderID){
  
  objectPath = path.resolve(objectPath)
  let frags = objectPath.split('/')
  let objectName = frags[frags.length-1]
  
  if(objectName.startsWith('.')) return
  
  let isDir = fs.lstatSync(objectPath).isDirectory()

  if(isDir){
    let folder = await createFolder(auth, objectName, parentFolderID)
    console.log('Created Folder:', objectName)
    console.log('Folder ID:', folder.data.id)
    
    let objects = getObjectsInFolder(objectPath)
    
    for(let i = 0; i < objects.length; i++){
      let nextObjectPath = path.join(objectPath, objects[i])
      await uploadObject(auth, nextObjectPath, folder.data.id)
    }
  }
  else {
    let file = await uploadFile(auth, objectPath, objectName, parentFolderID)
    console.log("\tFile:", objectName)
    console.log('\tFile Id:', file.data.id)
  }
}

function getObjectsInFolder(path){
  return fs.readdirSync(path)
}

function uploadFile(auth, filepath, filename, parentID){
  var fileMetadata = {
    name: filename,
    parents: [parentID]
  }
  
  return drive.files.create({
    auth: auth,
    resource: fileMetadata,
    media: { body: fs.createReadStream(filepath)},
    fields: 'id'
  })
}

function createFolder(auth, folderName, parentFolderID){
  let fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [parentFolderID]
  }

  return drive.files.create({ 
    auth: auth, 
    resource: fileMetadata, 
    fields: 'id'
  })
}

module.exports = async(path) => {
  let auth = await drivelib('./lib/token.json')
  return uploadObject(auth, path, mediaFolder)
}