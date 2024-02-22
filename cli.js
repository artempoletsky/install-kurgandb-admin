#! /usr/bin/env node
'use strict';
const fs = require("fs");
const args = process.argv.slice(2);

const ADMIN_ROOT = args[0] || "kurgandb";

const CWD = process.cwd();

function addGitIgnore(ignoreStrings) {

  const gitignoreFilePath = `${CWD}/.gitignore`;

  let gitignoreContents = "";
  if (fs.existsSync(gitignoreFilePath)) {
    gitignoreContents = fs.readFileSync(gitignoreFilePath, { encoding: "utf8" })
  }
  let lines = gitignoreContents.split(/\r?\n|\r|\n/g);
  ignoreStrings = ignoreStrings.filter(str => !lines.includes(str));

  for (const str of ignoreStrings) {
    gitignoreContents += str + "\r\n";
  }
  fs.writeFileSync(gitignoreFilePath, gitignoreContents);
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
  // console.log(jsonData);
  const deps = ["@artempoletsky/easyrpc", "../mydb", "@mantine/core", "@mantine/hooks", "tabler-icons-react"];

  exec(`npm install --save ${deps.join(" ")}`);
}

function main() {
  const sourceDir = `${__dirname}/install/adminroute/`;
  const targetDir = `${CWD}/app/${ADMIN_ROOT}/`;
  fs.cpSync(sourceDir, targetDir, { recursive: true });

  const sourceDir1 = `${__dirname}/install/kurgandb_admin/`;
  const targetDir1 = `${CWD}/app/kurgandb_admin/`;
  fs.cpSync(sourceDir1, targetDir1, { recursive: true });

  generateTSFile(targetDir);

  addGitIgnore([`/app/${ADMIN_ROOT}/`]);

  installDependencies();
}

if (require.main === module) {
  main();
}