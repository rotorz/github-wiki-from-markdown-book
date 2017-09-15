// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


const fs = require("fs");
const glob = require("glob");
const path = require("path");
const program = require("commander");

const constants = require("../constants");


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


// Get list of all markdown files in output path.
const generatedFilePaths = glob.sync(path.join(outputPath, "**/*.md"));

// Track directories that contained removed files.
const cleanedDirectories = new Set();

// Delete all markdown files that contain the generated output comment.
for (let filePath of generatedFilePaths) {
  let content = fs.readFileSync(filePath, "utf8");
  if (content.startsWith(constants.GENERATED_OUTPUT_COMMENT)) {
    console.log(`  Removing '${filePath}'...`);
    fs.unlinkSync(filePath);
    cleanedDirectories.add(path.dirname(filePath));
  }
}


//!TODO: Perhaps remove empty directories (see `cleanedDirectories`).
//for (let directoryPath of Array.from(cleanedDirectories).sort().reverse()) {
//  console.log(directoryPath);
//}
