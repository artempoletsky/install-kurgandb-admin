#! /usr/bin/env node
'use strict';
const fs = require("fs");
const args = process.argv.slice(2);

const ADMIN_ROOT = args[0] || "kurgandb";

const CWD = process.cwd();

function editGitignore(linesToAdd) {
  const filePath = `${CWD}/.gitignore`;

  const fileText = fs.existsSync(filePath) ? fs.readFileSync(filePath, { encoding: "utf8" }) : "";
  const lines = fileText.split(/\r?\n|\r|\n/g);


  function hasLine(key) {
    for (const l of lines) {
      if (l == key) return true;
    }
    return false;
  }

  for (const key of linesToAdd) {
    if (!hasLine(key)) {
      lines.push(key);
    }
  }

  fs.writeFileSync(filePath, lines.join("\r\n"));
}

function generateTSFile(targetDir) {
  const generatedFilePath = targetDir + "generated.ts";

  fs.writeFileSync(generatedFilePath, `export const ROOT_PATH = "${ADMIN_ROOT}";

export const API_ENDPOINT = "/" + ROOT_PATH + "/api/";
`);
}

const { exec } = require("child_process");

function installDependencies() {
  const packageFilePath = `${__dirname}/package.json`;
  const jsonData = JSON.parse(fs.readFileSync(packageFilePath));
  console.log("installing dependencies, please wait...");
  const deps = ["@artempoletsky/easyrpc", "@artempoletsky/kurgandb", "@mantine/core", "@mantine/hooks", "tabler-icons-react"];

  exec(`npm install --save ${deps.join(" ")}`);
}


function editEnvFile() {
  const filePath = `${CWD}/.env`;

  const fileText = fs.existsSync(filePath) ? fs.readFileSync(filePath, { encoding: "utf8" }) : "";
  const lines = fileText.split(/\r?\n|\r|\n/g);

  const linesToAdd = {
    KURGANDB_DATA_DIR: "D:/type/your/address/here",
    KURGANDB_REMOTE_ADDRESS: "http://localhost:8080"
  };

  function hasKey(key) {
    for (const l of lines) {
      if (l.includes(key)) return true;
    }
    return false;
  }

  for (const key in linesToAdd) {
    if (!hasKey(key)) {
      lines.push(`# ${key} = "${linesToAdd[key]}"`);
    }
  }

  fs.writeFileSync(filePath, lines.join("\r\n"));
}

function main() {
  const sourceDir = `${__dirname}/install/adminroute/`;
  const targetDir = `${CWD}/app/${ADMIN_ROOT}/`;
  fs.cpSync(sourceDir, targetDir, { recursive: true });

  const sourceDir1 = `${__dirname}/install/kurgandb_admin/`;
  const targetDir1 = `${CWD}/app/kurgandb_admin/`;
  fs.cpSync(sourceDir1, targetDir1, { recursive: true, force: false });

  generateTSFile(targetDir);

  editGitignore([`/app/${ADMIN_ROOT}/`, ".env"]);

  editEnvFile();

  installDependencies();
}

if (require.main === module) {
  main();
}