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
  const fullpath = path.join(
    constant.downloadPath,
    folderName.replace(" ", "_")
  );
  const cmd = `find ${fullpath} -path '*/.*' -prune -o -type f -print | zip ${fullpath}.zip -@`;
  exec(cmd, (err, stdout, stderr) => {
    console.log(stdout);
    if (err || stderr) console.error(err || stderr);
    res.sendFile(`${fullpath}.zip`);
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
