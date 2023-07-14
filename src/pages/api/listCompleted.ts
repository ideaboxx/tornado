import db from "@lib/db";
import { getToken } from "@lib/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function listCompleted(req: NextApiRequest, res: NextApiResponse) {
    const token = getToken(req, res);
    if (!token) return res.status(401).send({ error: "Authentication invalid" });

    const result = await db.query(
        "SELECT * from logs where status = 2 ORDER BY created_at desc"
    );
    res.send({ list: result.rows || [] });
}
