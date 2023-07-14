import db from "@lib/db";
import client from "@lib/torrentClient";
import { getToken } from "@lib/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function listCancelled(req: NextApiRequest, res: NextApiResponse) {
    const token = getToken(req, res);
    if (!token) return res.status(401).send({ error: "Authentication invalid" });

    const infoHashs = client.torrents.map((i) => i.infoHash);
    const result = await db.query(
        "SELECT * from logs where status in (0,3) ORDER BY created_at desc"
    );
    const list = (result.rows || []).filter((i) => !infoHashs.includes(i.info_hash));
    res.send({ list });
}
