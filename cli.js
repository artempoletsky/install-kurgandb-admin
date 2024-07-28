#!/usr/bin/env node

'use strict';
const fs = require("fs");
const pkg = require("./package.json");
let args = process.argv.slice(2);

const ENUM_OPTIONS = {
  fast: "--fast",
};


let ADMIN_ROOT;
if (!args[0] || args[0].startsWith("--")) {
  ADMIN_ROOT = "kurgandb";
} else {
  ADMIN_ROOT = args[0];
  args = args.slice(1);
}

const argsSet = new Set(args);

console.log(argsSet);

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
  const dataBaseType = "prisma";
  const generatedFilePath = targetDir + "generated.ts";

  fs.writeFileSync(generatedFilePath, `import type { DATABASE_TYPE } from "./globals";
    
    export const ROOT_PATH = "${ADMIN_ROOT}";

export const API_ENDPOINT = "/" + ROOT_PATH + "/api/";

export const ADMIN_VERSION = "${pkg.version}";

export const DB_TYPE: DATABASE_TYPE = "${dataBaseType}";
`);
}

// const { exec } = require("child_process");

const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

async function installDependencies() {
  const packageFilePath = `${process.cwd()}/package.json`;
  const jsonData = JSON.parse(fs.readFileSync(packageFilePath));
  console.log("installing dependencies, please wait...");
  const deps = [
    "@mantine/hooks", "@mantine/dates", "@mantine/form", "@mantine/core",
    "tabler-icons-react", "zod"
  ];

  // skip locally installed packages. It means that we are in the dev mode.
  const rpcName = "@artempoletsky/easyrpc";
  if (!jsonData.dependencies[rpcName] || !jsonData.dependencies[rpcName].startsWith("file:")) {
    deps.push(rpcName);
  }
  const dbName = "@artempoletsky/kurgandb";
  if (!jsonData.dependencies[dbName] || !jsonData.dependencies[dbName].startsWith("file:")) {
    deps.push(dbName);
  }
  const storeName = "@artempoletsky/easystore";
  if (!jsonData.dependencies[storeName] || !jsonData.dependencies[storeName].startsWith("file:")) {
    deps.push(storeName);
  }
  // console.log(deps.join(" "));

  for (const pkg of deps) {
    console.log(pkg);
    await exec(`npm install --save ${pkg}@latest`);
  }

}


function editEnvFile() {
  const filePath = `${CWD}/.env.local`;
  let fileContents = "";
  if (fs.existsSync(filePath)) {
    fileContents = fs.readFileSync(filePath, { encoding: "utf8" });
    console.log("Adding variables to '.env.local' ...");
  } else {
    console.log("No 'env.local' file found, creating...");
  }

  const lines = fileContents.split(/\r?\n|\r|\n/g);

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

function editImports(files) {
  for (const filename of files) {
    let contents = fs.readFileSync(filename, { encoding: "utf8" });
    contents = contents.replace(/\/adminroute\//g, "/" + ADMIN_ROOT + "/");
    fs.writeFileSync(filename, contents);
  }
}


function wrapTailwindBase(fileContents) {
  const iOf = fileContents.indexOf("@tailwind base");

  if (iOf == -1) {
    console.log("No '@tailwind base;' found. Consider fixing your globals.css manually.");
    return fileContents;
  }
  let wrapped = false;

  for (let i = iOf; i > 0; i--) {
    const char = fileContents[i];
    if (char == "}") break; // if we found different wrapping, consider tailwind unwrapped

    if (char == "{") { // probably a wrapping

      const head = fileContents.slice(0, i);
      wrapped = /^[\s\S]*@layer\s+\w+\s+\{$/
      break;
    }
  }
  if (wrapped) {
    console.log("'@tailwind base;' is wrapped already.");
    return fileContents;
  }

  console.log("Wrapping '@tailwind base;'...");

  return fileContents.replace("@tailwind base;", `@layer tailwind {
  @tailwind base;
}`);

}

function modifyGlobalsCSS() {
  const filePath = `${CWD}/app/globals.css`;

  if (!fs.existsSync(filePath)) {
    console.log("No globals.css found.");
    return;
  }
  let fileContents = fs.readFileSync(filePath, { encoding: "utf8" });
  // const mantineDatesImport = "@import '@mantine/dates/styles.css'";
  // const mantineCoreImport = "@import '@mantine/core/styles.css'";

  // if (!fileContents.includes(mantineDatesImport))
  //   fileContents = mantineDatesImport + ";\r\n" + fileContents;

  // if (!fileContents.includes(mantineCoreImport))
  //   fileContents = mantineCoreImport + ";\r\n" + fileContents;


  fs.writeFileSync(filePath, wrapTailwindBase(fileContents));
}

const rimraf = require("rimraf");

function main() {
  const sourceDir = `${__dirname}/install/adminroute/`;
  const targetDir = `${CWD}/app/${ADMIN_ROOT}/`;
  if (fs.existsSync(targetDir)) {
    console.log(`Removing previous ${targetDir}`);
    rimraf.sync(targetDir);
  }

  console.log(`installing in '${targetDir}'`);
  fs.cpSync(sourceDir, targetDir, { recursive: true });

  const sourceDir1 = `${__dirname}/install/kurgandb_admin/`;
  const targetDir1 = `${CWD}/app/kurgandb_admin/`;
  fs.cpSync(sourceDir1, targetDir1, { recursive: true, force: false });

  generateTSFile(targetDir);

  // editGitignore([`/app/${ADMIN_ROOT}/`]);

  editEnvFile();

  const compDir = `${targetDir1}components/`;
  const files = fs.readdirSync(compDir).map(f => compDir + f);

  files.push(`${targetDir1}field_scripts.ts`);
  files.push(`${targetDir1}codegen/db/generate_db.ts`);
  editImports(files);

  // modifyGlobalsCSS();
  if (!argsSet.has(ENUM_OPTIONS.fast)) {
    installDependencies();
  } else {
    console.log("skipping installing dependencies");
  }
}

if (require.main === module) {
  main();
}