import * as db from "@lib/db";
import client from "@lib/torrentClient";
import { NextApiRequest, NextApiResponse } from "next";

export default function deleteTorrent(req: NextApiRequest, res: NextApiResponse) {
    const { infoHash } = req.body;
    const torrent = client.get(infoHash);
    try {
        torrent.destroy();
        if (!torrent.done) {
            db.updateLog({ infoHash: torrent.infoHash, status: 3 });
        }
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
