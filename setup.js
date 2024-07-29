const fs = require("fs");

const CWD = process.cwd();

fs.copyFileSync(CWD + "/package.installed.json", CWD + "/package.json");

const setupDir = CWD + "/setup/";
const setupDirContent = fs.readdirSync(setupDir);

for (const filename of setupDirContent) {
    fs.copyFileSync(setupDir + filename, CWD + "/" + filename);
}

const lockFile = CWD + "/package-lock.json";

if (fs.existsSync(lockFile)) fs.unlinkSync(lockFile);