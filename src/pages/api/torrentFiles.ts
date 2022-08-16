import client from "@lib/torrentClient";

export default function torrentFiles(req, res) {
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
