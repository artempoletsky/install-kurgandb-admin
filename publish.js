const fs = require("fs");

const CWD = process.cwd();

fs.copyFileSync(CWD + "/package.json", CWD + "/package.installed.json");
fs.copyFileSync(CWD + "/package.npm.json", CWD + "/package.json");

const lockFile = CWD + "/package-lock.json";

if (fs.existsSync(lockFile)) fs.unlinkSync(lockFile);