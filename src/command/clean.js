// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


const program = require("commander");


program
  .option("-o, --output <path>", "Output path for generated Github wiki pages.")
  .parse(process.argv);


// Prepare Arguments:

const outputPath = program.output;

if (!outputPath || typeof outputPath !== "string") {
  console.error("Error: No output path was specified.");
  process.exit(1);
}


console.log(`Cleaning '${outputPath}'...`);
