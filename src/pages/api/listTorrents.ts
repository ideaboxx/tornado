import client from "@lib/torrentClient";
import { NextApiRequest, NextApiResponse } from "next";

export default function listTorrents(req: NextApiRequest, res: NextApiResponse) {
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
        });
    }
    res.send({ torrents });
}
