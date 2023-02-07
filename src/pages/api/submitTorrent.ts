import * as db from "@lib/db";
import * as fs from "fs";
import { uploadToDrive } from "@lib/gdrive";
import client from "@lib/torrentClient";
import { getToken } from "@lib/utils";
import config from "config";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default function submitTorrent(req: NextApiRequest, res: NextApiResponse) {
    const { magnet, torrentFile } = req.body;
    const torrent = magnet || Buffer.from(torrentFile, "base64");

    const uuid = getToken(req, res);
    if (!uuid) {
        return res.status(400).send({ error: "Invalid user id" });
    }

    // check if torrent file is valid
    if (!torrent) {
        return res.status(400).send({ error: "Invalid Magnet or torrent file" });
    }

    client.add(
        torrent,
        { path: process.env.DOWNLOAD_PATH || config.downloadPath },
        onReady(uuid)
    );
    res.send({
        status: "success",
    });
}

function onReady(userId: string) {
    return (torrent) => {
        db.insertLog({
            torrentName: torrent.name,
            infoHash: torrent.infoHash,
            magnet: torrent.magnetURI,
            status: 0,
        });
        torrent.on("done", async () => {
            console.log("[submitTorrent] Done downloading:", torrent.name);
            db.updateLog({ infoHash: torrent.infoHash, status: 1 });
            await uploadToDrive(userId, path.join(torrent.path, torrent.name));
            db.updateLog({ infoHash: torrent.infoHash, status: 2 });
            fs.rmSync(path.join(torrent.path, torrent.name), { recursive: true, force: true })
            console.log("[submitTorrent] Done uploading:", torrent.name);
        });
    };
}
