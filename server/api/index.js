const express = require("express");
const router = express.Router();
const WebTorrent = require("webtorrent");
const constant = require("../lib/constants.json");
const https = require("https");
const db = require("../lib/db");
const crypto = require("crypto");
const uploadFolder = require("../lib/uploadToDrive");
const path = require("path");

const sha256 = (x) =>
  crypto.createHash("sha256").update(x, "utf8").digest("hex");

router.use(express.json({ limit: "5mb" }));
const client = new WebTorrent();

setInterval(() => {
  const inProgress = client.torrents.filter((torrent) => !torrent.done);
  if (inProgress.length > 0) {
    https.get("https://tornedo.herokuapp.com");
    console.log("pinging host");
  }
}, 1000 * 60 * 5);

function onReady(uid) {
  return (torrent) => {
    db.insertLog({
      torrentName: torrent.name,
      infoHash: torrent.infoHash,
      magnet: torrent.magnetURI,
      status: 0,
    });
    torrent.on("done", async () => {
      const data = await db.getUser({ id: uid });
      const key = JSON.parse(data.key);
      db.updateLog({ infoHash: torrent.infoHash, status: 1 });
      await uploadFolder(key, path.join(torrent.path, torrent.name));
      db.updateLog({ infoHash: torrent.infoHash, status: 2 });
    });
  };
}

// define the home page route
router.get("/getAllTorrents", function (req, res) {
  const torrentList = [];
  for (const torrent of client.torrents) {
    const {
      name,
      infoHash,
      downloaded,
      uploaded,
      downloadSpeed,
      uploadSpeed,
      progress,
      ratio,
      numPeers,
      path,
      ready,
      paused,
      done,
      length,
    } = torrent;
    torrentList.push({
      name,
      infoHash,
      downloaded,
      uploaded,
      downloadSpeed,
      uploadSpeed,
      progress,
      ratio,
      numPeers,
      path,
      ready,
      paused,
      done,
      length,
    });
  }
  res.send({ status: "success", torrentList });
});

// define the about route
router.post("/addTorrent", function (req, res) {
  const { magnet, torrentFile, uid } = req.body;
  if (!uid)
    return res.send({
      status: "fail",
      err: "No uid",
    });
  const torrentId = magnet || Buffer.from(torrentFile, "base64");
  if (!torrentId) res.send({ status: "fail", err: "torrentId empty" });
  client.add(torrentId, { path: constant.downloadPath }, onReady(uid));
  console.log(">> torrent added");
  res.send({
    status: "success",
  });
});

// List all the files in the torrent
router.post("/getFiles", function (req, res) {
  const { infoHash } = req.body;
  const torrent = client.get(infoHash);
  const files = [];
  if (torrent && torrent.files) {
    for (const file of torrent.files) {
      const { name, path, length, downloaded, progress } = file;
      files.push({ name, path, length, downloaded, progress });
    }
  }
  res.send({ status: "success", files });
});

router.post("/actionDelete", function (req, res) {
  const { infoHash } = req.body;
  const torrent = client.get(infoHash);
  try {
    torrent.destroy();
    db.updateLog({ infoHash: torrent.infoHash, status: 3 });
    res.send({
      status: "success",
    });
  } catch (e) {
    res.send({
      status: "fail",
      message: e.toString(),
    });
  }
});

router.post("/actionPause", function (req, res) {
  const { infoHash } = req.body;
  const torrent = client.get(infoHash);
  try {
    torrent.pause();
    res.send({
      status: "success",
    });
  } catch (e) {
    res.send({
      status: "fail",
      message: e.toString(),
    });
  }
});

router.post("/actionResume", function (req, res) {
  const { infoHash } = req.body;
  const torrent = client.get(infoHash);
  try {
    torrent.resume();
    res.send({
      status: "success",
    });
  } catch (e) {
    res.send({
      status: "fail",
      message: e.toString(),
    });
  }
});

router.get("/getLogs", function (req, res) {
  db.getAllLogs().then((rows) =>
    res.send({
      status: "success",
      logs: rows,
    })
  );
});

router.post("/deleteLog", function (req, res) {
  db.deleteLog(req.body.id)
    .then((data) => res.send({ status: "success" }))
    .catch((err) => res.send({ status: "fail", err }));
});

router.post("/signin", async function (req, res) {
  const { email, password } = req.body;
  if (email && password) {
    const data = await db.getUser({ email, password: sha256(password) });
    if (data && data.id) {
      return res.send({ status: "success", uid: data.id });
    } else {
      return res.send({ status: "fail", err: "No user found" });
    }
  }
  res.send({ status: "fail", err: "Bad request" });
});

router.post("/signup", async function (req, res) {
  const { email, password, key } = req.body;
  if (email && password && key) {
    const id = sha256(email + password);
    const data = await db.signup({
      id,
      email,
      password: sha256(password),
      key,
    });
    if (data && data.length === 1) {
      return res.send({ status: "success", uid: data[0].id });
    } else {
      return res.send({ status: "fail", err: "No user found" });
    }
  }
  return res.send({ status: "fail", err: "Bad request" });
});

module.exports = router;
