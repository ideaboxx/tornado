const express = require('express')
const router = express.Router()
const WebTorrent = require('webtorrent')
const constant = require('../lib/constants.json')
const uploadToDrive = require('../lib/uploadToDrive')
const https = require('https');

router.use(express.json());

const client = new WebTorrent()
const torrentsUploadingToDrive = {}

setInterval(()=>{
    const inProgress = client.torrents.filter((torrent)=>!torrent.done)
    if (inProgress.length > 0) {
        https.get('https://tornedo.herokuapp.com')
        console.log('pinging host')
    }
}, 1000*60*5)

function onReady(torrent){
    torrent.on('done', ()=>{
        torrentsUploadingToDrive[torrent.infoHash] = true
        uploadToDrive(torrent).then(()=>{
            delete torrentsUploadingToDrive[torrent.infoHash]
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
        const uploadedToDrive = done && torrentsUploadingToDrive[infoHash] === true ? 
            'inProgress' : 'done' 
        torrentList.push({ name, infoHash, downloaded, uploaded, 
            downloadSpeed, uploadSpeed, progress, ratio, uploadedToDrive,
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