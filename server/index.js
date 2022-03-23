const express = require("express");
const app = express();
const path = require("path");
const { exec } = require("child_process");

const constant = require("./lib/constants");
const api = require("./api");

// Use to serve the `public` and `download` dir
app.use(express.static(path.join(__dirname, "build")));
app.use("/downloads", express.static(constant.downloadPath));

/** Common APIs */
app.use("/api", api);

// Send downloaded folder as zip
app.get("/zip", (req, res) => {
  const { folderName } = req.query;
  const srcFolder = path.join(constant.downloadPath, folderName);
  const destFolder = srcFolder + ".zip";
  const cmd = `find "${srcFolder}" -path '*/.*' -prune -o -type f -print | zip -0 "${destFolder}" -@`;
  exec(cmd, (err, stdout, stderr) => {
    if (err || stderr) return console.error(err || stderr);
    res.redirect("/downloads/" + folderName + ".zip");
  });
});

const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
