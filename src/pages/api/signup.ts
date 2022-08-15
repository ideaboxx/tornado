import * as db from "@lib/db";
import Cookies from "cookies";

export default async function signup(req, res) {
    const { email, password, key } = req.body;
    if (!email || !password || !key || !key.contents)
        return res.status(400).send("bad request");

    let user = await db.getUser({ email, password });
    if (user != null) return res.status(400).send({ error: "User already exist" });

    const keyJson = key.contents;
    const newUser = await db.signup({
        email,
        password,
        key: keyJson,
    });

    const cookies = new Cookies(req, res);
    cookies.set("token", newUser.uuid);
    res.send(newUser);
}
