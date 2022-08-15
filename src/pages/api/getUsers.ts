import db from "@lib/db";

export default async function users(req, res) {
    const result = await db.query("select * from usersTable");
    res.send(result.rows);
}
