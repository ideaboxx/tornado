import db from "@lib/db";
import { calcHash } from "@lib/utils";

export default async function users(req, res) {
    const result = await db.query("select * from logs");
    res.send(result.rows);
}
/*
res.send(
    result.rows.map(async (row) => {
        await db.query(
            "insert into usersTable (uuid, email, password, key) values ($1,$2,$3,$4)",
            [calcHash(row.email), row.email, row.password_hash, row.key]
        );
    })
);*/
