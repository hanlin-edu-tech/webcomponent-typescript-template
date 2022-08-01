const {Storage} = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");

async function uploadToGcs(machine) {
    const storage = new Storage({
        projectId: machine.projectId,
        keyFilename: machine.keyFilePath
    });

    const filePaths = await loopThroughFolderRecursive("dist");
    const tasks = [];

    for (const filePath of filePaths)
        tasks.push(uploadFile(storage, machine, filePath, 3));

    return Promise.all(tasks);
}

async function uploadFile(storage, machine, filePath, maxFails) {
    for (let i = 0; i < maxFails; i++) {
        try {
            await storage.bucket(machine.bucketName).upload(filePath, {
                destination: path.join(machine.gcsPath, filePath),
            });
            return;
        } catch (e) {
            console.warn(`Error while uploading ${filePath} to ${machine.projectId}, retrying...`)
            await sleep(1000);
        }
    }

    console.error(`Error while uploading ${filePath} to ${machine.projectId}, tried ${maxFails} times, gave up.`);
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
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