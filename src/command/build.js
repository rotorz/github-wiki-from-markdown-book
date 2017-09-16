// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const program = require("commander");

const BookBuilder = require("../BookBuilder");


program
  .option("-i, --input <path>", "Path to the YAML data file that composes the markdown book.")
  .option("-o, --output <path>", "Output path for generated Github wiki pages.")
  .parse(process.argv);


// Prepare Arguments:

if (!program.input || typeof program.input !== "string") {
  fatalError("No input path was specified.");
}

if (!program.output || typeof program.output !== "string") {
  fatalError("No output path was specified.");
}


let bookBuilder = BookBuilder.createFromYamlFile(program.input);

console.log(`Building "${bookBuilder.meta.title}" by ${bookBuilder.meta.author} to '${program.output}'...`);
bookBuilder.build(program.output);
