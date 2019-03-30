const WebTorrent = require("webtorrent");
const constants = require("./constants");
var rimraf = require("rimraf");

let client = new WebTorrent();
let torrent = null;

module.exports = function(app, io){
  
  app.get('/', (req, res) => {
    res.render('index.html')
  })

  io.on('connection', (socket) => {
    
    socket.on(constants.magnet, (data) => {
      if(data.magnet || data.magnet.trim() != ''){
        try {
          torrent = client.add(data.magnet, { path: constants.downloadPath })
          console.log("> New torrent download started")
        }
        catch {
          console.log("Failed to add new torrent..!")
        }
      }
    });

    socket.on(constants.destroy, () => {
      if(torrent) { 
        let pathToTorrentFiles = constants.downloadPath + torrent.name;
        torrent.destroy(function(){
          rimraf(pathToTorrentFiles, function () { 
            console.log("> Torrent download stopped and files cleared")
            socket.emit(constants.destroy);
          })
        })
      }
    });

    socket.on(constants.getUpdate, () => {
      if(torrent) {
        let data = {
          name : torrent.name,
          progress: torrent.progress,
          downloadSpeed: torrent.downloadSpeed,
          downloaded: torrent.downloaded,
          files: []
        }
        for(let i in torrent.files){
          let fileObj = {
            filename: torrent.files[i].name,
            path: torrent.files[i].path,
            progress: torrent.files[i].progress,
            downloaded: torrent.files[i].downloaded,
            length: torrent.files[i].length
          }
          data.files.push(fileObj)
        }

        if(data.progress == 1){
          torrent.destroy()
          console.log("> Torrent Downloaded: " + data.name)
        }
        socket.emit(constants.getUpdate, data);
      }
      else {
        console.log("> Torrent not ready !!");
      }
    });

  })
}