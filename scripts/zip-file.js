// Author: https://github.com/mtmckenna/js13kgames-parcel-starter
const fs = require("fs");
const archiver = require("archiver");

const distDir = process.cwd() + "/public";
const output = fs.createWriteStream(distDir + "/game.zip");
const archive = archiver("zip", { zlib: { level: 9 } });

archive.pipe(output);
archive.file(distDir + "/index.html", { name: "index.html" });

archive.finalize();
