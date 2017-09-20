// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const program = require("commander");

const cleanOutputAssetDirectories = require("../behaviors/cleanOutputAssetDirectories");
const cleanOutputGeneratedTopics = require("../behaviors/cleanOutputGeneratedTopics");
const loadBookFromYamlFile = require("../behaviors/loadBookFromYamlFile");


program
  .option("-i, --input <path>", "Path to the YAML data file that composes the markdown book.")
  .option("-o, --output <path>", "Output path for generated Github wiki pages.")
  .parse(process.argv);


// Prepare Arguments:

if (!program.input || typeof program.input !== "string") {
  throw new Error("No input path was specified.");
}

if (!program.output || typeof program.output !== "string") {
  throw new Error("No output path was specified.");
}


let book = loadBookFromYamlFile(program.input);


console.log(`Cleaning '${program.output}'...`);
cleanOutputAssetDirectories(book, program.output);
cleanOutputGeneratedTopics(book, program.output);
