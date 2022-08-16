import db from "@lib/db";
import { getToken } from "@lib/utils";

export default async function deleteLog(req, res) {
    const uuid = getToken(req, res);
    if (uuid) {
        const query = "DELETE FROM logs WHERE id = $1";
        await db.query(query, [req.body.id]);
        return res.send();
    }
    res.status(400).send({ error: "Invalid uuid" });
}
