

const sourceDir = `${__dirname}/install/adminroute/`;
const targetDir = `${__dirname}/app/kurgandb/`;

const fs = require("fs");
// console.log(sourceDir, targetDir);

fs.cpSync(targetDir, sourceDir, { recursive: true });

const sourceDir1 = `${__dirname}/install/kurgandb_admin/`;
const targetDir1 = `${__dirname}/app/kurgandb_admin/`;

fs.cpSync(targetDir1, sourceDir1, { recursive: true });


function editImports(files) {
  for (const filename of files) {
    let contents = fs.readFileSync(filename, { encoding: "utf8" });

    contents = contents.replace(/\/kurgandb\//g, "/adminroute/");
    fs.writeFileSync(filename, contents);
  }
}

const compDir = `${sourceDir1}components/`;
const files = fs.readdirSync(compDir).map(f => compDir + f);

editImports([`${sourceDir1}field_scripts.ts`, ...files]);