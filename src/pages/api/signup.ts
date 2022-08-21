import * as db from "@lib/db";
import Cookies from "cookies";

export default async function signup(req, res) {
    const { email, password, key, keepLoggedIn } = req.body;
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
    const config = { sameSite: true };
    if (keepLoggedIn) config["maxAge"] = Date.now() + 6 * 24 * 60 * 60 * 1000;
    cookies.set("token", user.uuid, config);
    res.send(newUser);
}
