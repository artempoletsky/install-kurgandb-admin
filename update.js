const rimraf = require("rimraf");
rimraf.sync(`${__dirname}/install/`);

const sourceAdminrouteDir = `${__dirname}/install/adminroute/`;
const targetAdminrouteDir = `${__dirname}/app/adminroute/`;

const fs = require("fs");
// console.log(sourceDir, targetDir);

fs.cpSync(targetAdminrouteDir, sourceAdminrouteDir, { recursive: true });

const sourceUserDir = `${__dirname}/install/kurgandb_admin/`;
const targetUserDir = `${__dirname}/lib/kurgandb/`;

fs.cpSync(targetUserDir, sourceUserDir, { recursive: true });
