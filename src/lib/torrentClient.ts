import registerService from "./registerService";
import WebTorrent from "webtorrent";

const client = registerService("webtorrent", () => new WebTorrent());

export default client;
