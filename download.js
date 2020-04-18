const { google } = require('googleapis')
const drive = google.drive('v3')
const drivelib = require('./lib/driveLib')
const fs = require('fs')

async function init(){
  let auth = await drivelib('./lib/token.json');
  const drive = google.drive({version: 'v3', auth});
  drive.files.list({
    pageSize: 100,
    q: "mimeType='video/mp4' or mimeType='video/x-matroska'",
  }, (err, res) => {
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(file);
      });
    } else {
      console.log('No files found.');
    }
  });
}

async function downloadFile() {
 let auth = await drivelib('./lib/token.json');
 const drive = google.drive({version: 'v3', auth});
 var fileId = '1ni7FYKu56WlYHsmWCG3H1En6yFC3naoh';
 var dest = fs.createWriteStream('sample.mkv');
 drive.files.get({fileId: fileId, alt: 'media'}, 
  {headers: {Range: 'bytes=50-1023'}},
  function(err, res){
     console.log(err)
     res.data
     .on('end', () => {
        console.log('Done');
     })
     .on('error', err => {
        console.log('Error', err);
     })
     .pipe(dest);
  })
}


downloadFile();