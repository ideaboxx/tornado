const { Pool } = require("pg");
const constants = require("./constants.json");

//vacofoh437@qkerbl.com - thisismyfirstven...

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || constants.postgresDev,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function getAllLogs() {
  const res = await pool.query("SELECT * from logs ORDER BY created_at desc");
  return res.rows || [];
}

async function insertLog({ torrentName, infoHash, magnet, status }) {
  const query =
    "Insert into logs(torrent_name, info_hash, magnet, status) values($1,$2,$3,$4) RETURNING *";
  const res = await pool.query(query, [torrentName, infoHash, magnet, status]);
  return res.rows || [];
}

async function updateLog({ id, infoHash, status }) {
  if (id) {
    const query = "UPDATE logs SET status = $1 where id = $2";
    const res = await pool.query(query, [status, id]);
    return res.rows || [];
  } else if (infoHash) {
    const query = "UPDATE logs SET status = $1 where info_hash = $2";
    const res = await pool.query(query, [status, infoHash]);
    return res.rows || [];
  }
}

async function deleteLog(id) {
  if (!id) return;
  const query = "DELETE FROM logs WHERE id = $1";
  const res = await pool.query(query, [id]);
  return res;
}

module.exports = { getAllLogs, insertLog, updateLog, deleteLog };
