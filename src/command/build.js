// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


const program = require("commander");


program
  .option("-i, --input <path>", "Path to the YAML data file that composes the markdown book.")
  .option("-o, --output <path>", "Output path for generated Github wiki pages.")
  .parse(process.argv);


// Prepare Arguments:

const inputPath = program.input;
const outputPath = program.output;

if (!inputPath || typeof inputPath !== "string") {
  console.error("Error: No input path was specified.");
  process.exit(1);
}

if (!outputPath || typeof outputPath !== "string") {
  console.error("Error: No output path was specified.");
  process.exit(1);
}


console.log(`Building '${inputPath}' to '${outputPath}'...`);
