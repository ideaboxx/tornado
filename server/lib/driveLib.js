const fs = require('fs')
const path = require('path');

const { google } = require('googleapis')
const { client_secret, client_id, redirect_uris } = require('./credentials.json').installed

const token = require('./token.json')
const drive = google.drive('v3')

let oAuthClient = null;

/**
 * get oAuth2Client from google api
 * @param {string} tokenPath - path of token file (you need to generate token file using gdrive oAuth)
 */
function getAuthClient(tokenPath) {
  return new Promise((resolve, reject) => {
    if(oAuthClient != null) resolve(oAuthClient)
    oAuthClient = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
    oAuthClient.setCredentials(token)
    resolve(oAuthClient)
  })
}

/**
 * Create folder in drive
 * @param {string} parentId - parent folder id
 * @param {string} folderName - folder name
 */
function createFolder(parentId, folderName, oAuth){
  return drive.files.create({
    auth: oAuth || oAuthClient, 
    fields: 'id',
    resource: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId]
    }
  })
}

/**
 * Upload file to Google Drive
 * @param {string} parentId 
 * @param {string} serverFilePath 
 * @param {oAuthClient(string)} oAuth 
 * @returns Drive.File
 */
function uploadFile(parentId, serverFilePath, oAuth){
  let filename = path.basename(serverFilePath)
  return drive.files.create({
    auth: oAuth || oAuthClient,
    fields: 'id',
    media: { 
      body: fs.createReadStream(serverFilePath) 
    },
    resource: {
      name: filename, parents: [parentId]
    }
  })
}

module.exports = { getAuthClient, createFolder, uploadFile}