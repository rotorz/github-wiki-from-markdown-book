// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const fs = require("fs-extra");
const glob = require("glob");
const path = require("path");

const constants = require("../constants");


/**
 * Removes generated topic files from the output directory.
 *
 * @param {Book} book
 *   The book that is to be cleaned.
 * @param {string} outputPath
 *   Path to directory where generated output are saved.
 */
function cleanOutputGeneratedTopics(book, outputPath) {
  // Get list of all markdown files in output path.
  const generatedFilePaths = glob.sync(path.join(outputPath, "**/*.md"));

  // Track directories that contained removed files.
  const cleanedDirectories = new Set();


  // Delete all markdown files that contain the generated output comment.
  for (let filePath of generatedFilePaths) {
    let text = fs.readFileSync(filePath, "utf8");
    if (text.startsWith(constants.GENERATED_OUTPUT_COMMENT)) {
      console.log(`  Removing '${filePath}'...`);
      fs.unlinkSync(filePath);
      cleanedDirectories.add(path.dirname(filePath));
    }
  }


  //!TODO: Perhaps remove empty directories (see `cleanedDirectories`).
  //for (let directoryPath of Array.from(cleanedDirectories).sort().reverse()) {
  //  console.log(directoryPath);
  //}
}


module.exports = cleanOutputGeneratedTopics;
