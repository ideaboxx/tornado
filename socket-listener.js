const WebTorrent = require('webtorrent');
const constants = require('./constants');
const uploadToDrive = require('./uploadToDrive')
const rimraf = require('rimraf');

let client = new WebTorrent();
let torrent = null;
let torrentQueue = [];

function processTorrents(){
  if(!torrent || torrent.progress == 1) {
    try {
      torrent = client.add(torrentQueue.pop(), {
        path: constants.downloadPath
      })
      console.log("> New torrent download started")
    } catch {
      console.log("Failed to add new torrent..!")
    }
  }
}

module.exports = function (socket) {
  
  /* call this channel when new magnet link is input */
  socket.on(constants.magnet, (data) => {
    if (data.magnet || data.magnet.trim() != '') {
      torrentQueue.push(data.magnet)
      processTorrents()
    }
  });

  /* Call this channel when you want to destroy torrent */
  socket.on(constants.destroy, () => {
    if (!torrent) return
    let pathToTorrentFiles = constants.downloadPath + torrent.name;
    torrent.destroy(function () {
      rimraf(pathToTorrentFiles, function () {
        console.log("> Torrent download stopped and files cleared")
        socket.emit(constants.alertMessage, "Torrent download stopped..")
      })
    })
  });

  /* Call this channel when you want to get updates about torrent */
  socket.on(constants.getUpdate, () => {
    if (torrent) {
      let data = {
        name: torrent.name,
        progress: torrent.progress,
        downloadSpeed: torrent.downloadSpeed,
        downloaded: torrent.downloaded,
        files: []
      }

      for (let i in torrent.files) {
        let fileObj = {
          filename: torrent.files[i].name,
          path: torrent.files[i].path,
          progress: torrent.files[i].progress,
          downloaded: torrent.files[i].downloaded,
          length: torrent.files[i].length
        }
        data.files.push(fileObj)
      }

      if (data.progress == 1) {
        torrent.destroy()
        console.log("> Torrent Downloaded: " + data.name)
        socket.emit(constants.alertMessage, "Torrent Downloaded.. now uploading to gdrive")

        let pathToTorrentFiles = constants.downloadPath + torrent.name
        
        uploadToDrive(pathToTorrentFiles).then(() => {
          socket.emit(constants.alertMessage, "Uploaded to GDrive..")
        })
        .catch((exception) => {
          socket.emit(constants.alertMessage, "Uploaded to GDrive failed..")
          console.log(exception)
        })

        if(torrentQueue.length > 0) processTorrents()
      }
      socket.emit(constants.getUpdate, data);
    } else {
      console.log("> Torrent not ready !!");
    }
  })

  /* Call this channel when you want to get torrent Queue */
  socket.on(constants.getPendingQueue, () => {
    socket.emit(constants.getPendingQueue, torrentQueue)
  })
}