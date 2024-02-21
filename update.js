#! /usr/bin/env node
'use strict';

function main() {
  console.log("Hello from main");
}

if (require.main === module) {
  main();
}

