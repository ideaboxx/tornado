import db from "@lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function listCompleted(req: NextApiRequest, res: NextApiResponse) {
    const result = await db.query(
        "SELECT * from logs where status = 2 ORDER BY created_at desc"
    );
    res.send({ list: result.rows || [] });
}
