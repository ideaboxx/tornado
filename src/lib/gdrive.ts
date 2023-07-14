import GdriveFS from "@ideabox/cloud-drive-fs";
import db from "@lib/db";
import fs from "fs";
import path from "path";

export default async function getGFS(uuid) {
    if (uuid in global && global[uuid] != null) {
        return global[uuid] as GdriveFS;
    }
    const q = await db.query(`SELECT key FROM usersTable WHERE uuid=$1`, [uuid]);
    if (q.rowCount == 1) {
        global[uuid] = new GdriveFS({
            key: q.rows[0].key,
            driveName: "gdrive-fs",
            debug: process.env.NODE_ENV != "production",
        });
    }
    return global[uuid] as GdriveFS;
}

async function uploadFolder(rootPath, parentId, g) {
    console.log("Uploading:", rootPath);
    try {
        if (fs.lstatSync(rootPath).isDirectory()) {
            const dirname = path.basename(rootPath);
            const folder = await g.createFolder(dirname, parentId);
            for (const file of fs.readdirSync(rootPath)) {
                console.log("->", file);
                const filepath = path.join(rootPath, file);
                if (fs.lstatSync(filepath).isDirectory()) {
                    await uploadFolder(filepath, folder.id, g);
                } else {
                    await uploadFile(filepath, file, folder.id, g);
                }
            }
        } else {
            const filename = path.basename(rootPath);
            await uploadFile(rootPath, filename, parentId, g);
        }
    } catch (e) {
        console.log(e);
    }
}

async function uploadFile(filepath, name, folderId, g) {
    try {
        await g.uploadFile(fs.createReadStream(filepath), {
            name: name,
            size: fs.statSync(filepath).size,
            parentId: folderId,
        });
    } catch (e) {
        console.log(e);
    }
}

export async function uploadToDrive(uuid, rootPath) {
    const g = await getGFS(uuid);
    const folderName = "tornedo-downloads";
    const torrFolder = (await g.list()).filter((f) => f.name === folderName)[0];
    await uploadFolder(rootPath, torrFolder.id, g);
}
