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
  const deps = [
    "@artempoletsky/easyrpc", "@artempoletsky/kurgandb",
    "@mantine/core", "@mantine/hooks", "@mantine/dates", "@mantine/form",
    "tabler-icons-react", "zod"
  ];

  exec(`npm install --save ${deps.join(" ")}`);
}


function editEnvFile() {
  const filePath = `${CWD}/.env.local`;

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

  let fileContents = fs.readFileSync(filePath, { encoding: "utf8" });
  // const mantineDatesImport = "@import '@mantine/dates/styles.css'";
  // const mantineCoreImport = "@import '@mantine/core/styles.css'";

  // if (!fileContents.includes(mantineDatesImport))
  //   fileContents = mantineDatesImport + ";\r\n" + fileContents;

  // if (!fileContents.includes(mantineCoreImport))
  //   fileContents = mantineCoreImport + ";\r\n" + fileContents;

  
  fs.writeFileSync(filePath, wrapTailwindBase(fileContents));
}

function main() {
  const sourceDir = `${__dirname}/install/adminroute/`;
  const targetDir = `${CWD}/app/${ADMIN_ROOT}/`;
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

  editImports([`${targetDir1}field_scripts.ts`, ...files]);

  modifyGlobalsCSS();
  installDependencies();
}

if (require.main === module) {
  main();
}