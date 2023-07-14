import client from "@lib/torrentClient";
import { getToken } from "@lib/utils";

export default function torrentFiles(req, res) {
    const token = getToken(req, res);
    if (!token) return res.status(401).send({ error: "Authentication invalid" });

    const { infoHash } = req.body;
    const torrent = client.get(infoHash);
    const files = [];
    if (torrent && torrent.files) {
        for (const file of torrent.files) {
            const { name, path, length, downloaded, progress } = file;
            files.push({ name, path, length, downloaded, progress });
        }
    }
    res.send({ files });
}
