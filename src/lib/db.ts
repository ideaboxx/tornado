import registerService from './registerService';
import { Pool } from 'pg';
import { calcHash } from './utils';
import * as fs from 'fs';

const env: any = process.env;
let password = env.DB_PASSWORD;

if (process.env.DB_PASSWORD_FILE) {
	password = fs.readFileSync(process.env.DB_PASSWORD_FILE, 'utf-8').trim();
}

if (!password) {
	console.error(`Database Password Invalid: '${process.env.DB_PASSWORD}'`);
	process.exit(1);
}

const pool = registerService('db', () => {
	const pool = new Pool({
		user: process.env.DB_USER,
		database: process.env.DB_DATABASE,
		password: password,
		port: parseInt(process.env.DB_PORT || '5432'),
		host: process.env.DB_HOST || 'db'
	});
	createTables(pool);
	return pool;
});

async function createTables(pool) {
	await pool.connect();
	await pool.query(`
    CREATE TABLE IF NOT EXISTS usersTable (
        id serial PRIMARY KEY,
        uuid TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        key JSON NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP 
     )`);
	console.log('User table created..');
	await pool.query(`
    CREATE TABLE IF NOT EXISTS logs (
      id serial PRIMARY KEY,
      torrent_name VARCHAR (200) NOT NULL,
      info_hash VARCHAR (100) NOT NULL,
      magnet text,
      status integer,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP 
     )`);
}

const queryObject = {
	query: (text: any, params?: any) => pool.query(text, params)
};

export default queryObject;

export async function insertLog({ torrentName, infoHash, magnet, status }) {
	const query =
		'Insert into logs(torrent_name, info_hash, magnet, status) values($1,$2,$3,$4) RETURNING *';
	const res = await pool.query(query, [torrentName, infoHash, magnet, status]);
	return res.rows || [];
}

export async function updateLog({ infoHash, status }) {
	/*if (id) {
		const query = "UPDATE logs SET status = $1 where id = $2";
		const res = await pool.query(query, [status, id]);
		return res.rows || [];
	} else if (infoHash) {*/
	const query = 'UPDATE logs SET status = $1 where info_hash = $2';
	const res = await pool.query(query, [status, infoHash]);
	return res.rows || [];
	//}
}

export async function deleteLog(id) {
	if (!id) return;
	const query = 'DELETE FROM logs WHERE id = $1';
	const res = await pool.query(query, [id]);
	return res;
}

export async function signup({ email, password, key }) {
	console.log('adding user..');
	const query =
		'Insert into usersTable(uuid, email, password, key) values($1,$2,$3,$4) RETURNING *';
	const res = await pool.query(query, [
		calcHash(email + password),
		email,
		calcHash(password),
		key
	]);
	return res.rows || [];
}

export async function getUser({ email, password }: { email: string; password: string }) {
	const q =
		'SELECT * from usersTable where email=$1 and password=$2 ORDER BY created_at desc';
	const res = await pool.query(q, [email, calcHash(password)]);
	return res.rows[0] || null;
}

export async function getUserById(id: string) {
	const res = await pool.query('SELECT * from usersTable where uuid=$1', [id]);
	return res.rows[0] || null;
}
