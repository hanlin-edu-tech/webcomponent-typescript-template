const {Storage} = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");


async function uploadToGcs(machine) {
    const storage = new Storage({
        projectId: machine.projectId,
        keyFilename: machine.keyFilePath
    });

    const filePaths = await loopThroughFolderRecursive("dist");

    for (const p of filePaths) {
        await storage.bucket(machine.bucketName).upload(p, {
            destination: path.join(machine.gcsPath, p),
        });
    }
}


async function loopThroughFolderRecursive(basePath, arr = []) {
    const files = fs.readdirSync(basePath);

    for (const f of files) {
        const fullPath = path.join(basePath, f);
        const stats = await fs.promises.stat(fullPath);

        if (stats.isDirectory())
            await loopThroughFolderRecursive(fullPath, arr);
        else
            arr.push(fullPath);
    }

    return arr;
}

exports.uploadToGcs = (machine) => uploadToGcs(machine);