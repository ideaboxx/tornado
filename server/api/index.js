const express = require('express')
const router = express.Router()
const WebTorrent = require('webtorrent')
const constant = require('../lib/constants.json')
const uploadToDrive = require('../lib/uploadToDrive')
const https = require('https');
const db = require('../lib/db')

router.use(express.json());
const client = new WebTorrent()

setInterval(()=>{
    const inProgress = client.torrents.filter((torrent)=>!torrent.done)
    if (inProgress.length > 0) {
        https.get('https://tornedo.herokuapp.com')
        console.log('pinging host')
    }
}, 1000*60*5)

function onReady(torrent){
    db.insertLog({
        torrentName: torrent.name,
        infoHash: torrent.infoHash,
        magnet: torrent.magnetURI,
        status: 0
    })
    torrent.on('done', ()=>{
        db.updateLog({infoHash: torrent.infoHash, status: 2})
        uploadToDrive(torrent).then(()=>{
            db.updateLog({infoHash: torrent.infoHash, status: 3})
        })
    })
}

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
    const torrentId = magnet || Buffer.from(torrentFile, 'base64')
    client.add(torrentId, { path: constant.downloadPath }, onReady)
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
        db.updateLog({infoHash: torrent.infoHash, status: 4})
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

router.get('/getLogs', function(req, res){
    db.getAllHistory().then(rows=>res.send({
        status: 'success', data: rows
    }))
})

module.exports = router