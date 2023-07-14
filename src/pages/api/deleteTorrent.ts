import * as db from "@lib/db";
import client from "@lib/torrentClient";
import { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs";
import path from "path";

export default function deleteTorrent(req: NextApiRequest, res: NextApiResponse) {
    const { infoHash } = req.body;
    const torrent = client.get(infoHash);
    try {
        torrent.destroy();
        if (!torrent.done) {
            db.updateLog({ infoHash: torrent.infoHash, status: 3 });
        }
        fs.rmSync(path.join(torrent.path, torrent.name), { recursive: true, force: true })
        res.send({
            status: "success",
        });
    } catch (e) {
        res.send({
            status: "fail",
            message: e.toString(),
        });
    }
}
