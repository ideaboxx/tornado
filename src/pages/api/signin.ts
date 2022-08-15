import * as db from "@lib/db";
import Cookies from "cookies";

export default async function signin(req, res) {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ error: "bad request" });
    let user = await db.getUser({ email, password });
    if (user != null) {
        const cookies = new Cookies(req, res);
        cookies.set("token", user.uuid, {
            sameSite: true,
        });
        return res.status(200).send(user);
    }
    return res.status(401).send({ error: "Authentication failed" });
}
