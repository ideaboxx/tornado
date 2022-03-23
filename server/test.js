const uploadFolder = require("./lib/uploadToDrive");
const db = require("./lib/db");

const uid = "46f084a63cffe19ac24089a6182057f020cbdfd0209ccfac6bcc52fe2bd5dd9f";

async function main() {
  const data = await db.getUser({ id: uid });
  uploadFolder(JSON.parse(data.key), "/home/tilak_sasmal999/tornado/server");
}

main();
