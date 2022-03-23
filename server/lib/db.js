const { Pool } = require("pg");
const constants = require("./constants.json");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || constants.postgresDev,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.query(`CREATE TABLE IF NOT EXISTS logs (
 id serial PRIMARY KEY,
 torrent_name VARCHAR (200) NOT NULL,
 info_hash VARCHAR (100) NOT NULL,
 magnet text,
 status integer,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP 
)`);

pool.query(`CREATE TABLE IF NOT EXISTS users (
 id VARCHAR (200) PRIMARY KEY,
 email VARCHAR (200) NOT NULL,
 password_hash VARCHAR (100) NOT NULL,
 key text,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP 
)`);

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

async function signup({ id, email, password, key }) {
  const query =
    "Insert into users(id, email, password_hash, key) values($1,$2,$3,$4) RETURNING *";
  const res = await pool.query(query, [id, email, password, key]);
  return res.rows || [];
}

async function getUser({ id, email, password }) {
  if (id) {
    const res = await pool.query("SELECT * from users where id=$1", [id]);
    return res.rows[0] || {};
  } else {
    const q =
      "SELECT * from users where email=$1 and password_hash=$2 ORDER BY created_at desc";
    const res = await pool.query(q, [email, password]);
    return res.rows[0] || {};
  }
}

module.exports = {
  getAllLogs,
  insertLog,
  updateLog,
  deleteLog,
  signup,
  getUser,
};
