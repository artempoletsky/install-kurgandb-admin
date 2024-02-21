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

  fs.writeFileSync(generatedFilePath, 
`export const ROOT_PATH = "${ADMIN_ROOT}";

export const API_ENDPOINT = "/" + ROOT_PATH + "/api/";
`);
}

function main() {
  const sourceDir = `${__dirname}/install/adminroute/`;
  const targetDir = `${CWD}/app/${ADMIN_ROOT}/`;
  fs.cpSync(sourceDir, targetDir, { recursive: true });

  generateTSFile(targetDir);

  addGitIgnore([`/app/${ADMIN_ROOT}/`]);
}

if (require.main === module) {
  main();
}