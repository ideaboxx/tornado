const express = require('express')
const router = express.Router()
const WebTorrent = require('webtorrent')
const constant = require('../lib/constants.json')
const uploadToDrive = require('../lib/uploadToDrive')

const client = new WebTorrent({ maxConns: 500 })

router.use(express.json());

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

// define the home page route
router.get('/getAllTorrents', function (req, res) {
    const torrentList = []
    for(const torrent of client.torrents) {
        const { name, infoHash, downloaded, uploaded, 
            downloadSpeed, uploadSpeed, progress, ratio, 
            numPeers, path, ready, paused, done, length } = torrent
        torrentList.push({ name, infoHash, downloaded, uploaded, 
            downloadSpeed, uploadSpeed, progress, ratio, 
            numPeers, path, ready, paused, done, length })
    }
    res.send({ status: 'success', torrentList })
})

// define the about route
router.post('/addTorrent', function (req, res) {
    const { magnet, torrentFile } = req.body
    const torrentId = magnet || (new Buffer(torrentFile))
    client.add(torrentId, { path: constant.downloadPath }, function(torrent){
        torrent.on('done', ()=>uploadToDrive(torrent))
    })
    console.log(">> torrent added")
    res.send({
        status: "success"
    })
})

// List all the files in the torrent
router.post('/getFiles', function(req, res){
    const { infoHash } = req.body
    const torrent = client.get(infoHash)
    const files = []
    for(const file of torrent.files) {
        const { name, path, length, downloaded, progress} = file
        files.push({ name, path, length, downloaded, progress })
    }
    res.send({ status: 'success', files})
})

router.post('/actionDelete', function(req, res){
    const { infoHash } = req.body
    const torrent = client.get(infoHash)
    try {
        torrent.destroy()
        res.send({
            status: 'success',
        })
    } catch(e){
        res.send({
            status: 'fail',
            message: e.toString()
        })
    }
})

router.post('/actionPause', function(req, res){
    const { infoHash } = req.body
    const torrent = client.get(infoHash)
    try {
        torrent.pause()
        res.send({
            status: 'success',
        })
    } catch(e){
        res.send({
            status: 'fail',
            message: e.toString()
        })
    }
})

router.post('/actionResume', function(req, res){
    const { infoHash } = req.body
    const torrent = client.get(infoHash)
    try {
        torrent.resume()
        res.send({
            status: 'success',
        })
    } catch(e){
        res.send({
            status: 'fail',
            message: e.toString()
        })
    }
})

module.exports = router