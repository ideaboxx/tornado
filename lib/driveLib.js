const fs = require('fs')
const { google } = require('googleapis')
const credentials = require('./credentials.json')

let oAuth2Client = null;

function authorize(tokenPath) {
  return new Promise(function(resolve, reject) {
    const { client_secret, client_id, redirect_uris } = credentials.installed
    oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
    var token = fs.readFileSync(tokenPath)
    oAuth2Client.setCredentials(JSON.parse(token))
    resolve(oAuth2Client)
  })
}

module.exports = authorize;