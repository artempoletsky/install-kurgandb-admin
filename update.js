

const sourceDir = `${__dirname}/install/adminroute/`;
const targetDir = `${__dirname}/app/kurgandb/`;

const fs = require("fs");
// console.log(sourceDir, targetDir);

fs.cpSync(targetDir, sourceDir, { recursive: true });