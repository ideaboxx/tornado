import db from "@lib/db";
import client from "@lib/torrentClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function listTorrents(req: NextApiRequest, res: NextApiResponse) {
    const torrents = [];

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
        torrents.push({
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
            uploadedToDrive: done ? await getStatus(infoHash) : false,
        });
    }
    res.send({ torrents });
}

async function getStatus(infoHash: string) {
    const result = await db.query("SELECT * from logs where info_hash = $1", [infoHash]);
    return result.rows[0].status == 2;
}
