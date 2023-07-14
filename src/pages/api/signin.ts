import * as db from "@lib/db";
import Cookies from "cookies";

export default async function signin(req, res) {
    const { email, password, keepLoggedIn } = req.body;
    if (!email || !password) return res.status(400).send({ error: "bad request" });
    let user = await db.getUser({ email, password });
    if (user != null) {
        const cookies = new Cookies(req, res);
        const config = { sameSite: true };
        if (keepLoggedIn) config["maxAge"] = Date.now() + 6 * 24 * 60 * 60 * 1000;
        cookies.set("token", user.uuid, config);
        console.log(config);
        return res.status(200).send(user);
    }
    return res.status(401).send({ error: "Authentication failed" });
}
