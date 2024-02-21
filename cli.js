#! /usr/bin/env node
'use strict';
const fs = require("fs");

function main() {
  console.log("Hello from main");
}

if (require.main === module) {
  main();
}