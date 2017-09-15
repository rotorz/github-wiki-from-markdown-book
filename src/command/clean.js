// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


const program = require("commander");


program
  .option("-o, --output <path>", "Output path for generated Github wiki pages.")
  .parse(process.argv);


// Program Start:

console.log(`Cleaning '${program.output}'...`);
