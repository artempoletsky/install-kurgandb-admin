

const sourceDir = `${__dirname}/install/adminroute/`;
const targetDir = `${__dirname}/app/adminroute/`;

const fs = require("fs");
// console.log(sourceDir, targetDir);

fs.cpSync(targetDir, sourceDir, { recursive: true });

const sourceDir1 = `${__dirname}/install/kurgandb_admin/`;
const targetDir1 = `${__dirname}/app/kurgandb_admin/`;

fs.cpSync(targetDir1, sourceDir1, { recursive: true });
