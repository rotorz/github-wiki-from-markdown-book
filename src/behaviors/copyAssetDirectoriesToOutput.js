// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const fs = require("fs-extra");
const path = require("path");


/**
 * Copies asset directories to the output directory.
 *
 * @param {Book} book
 *   The book that is to be built.
 * @param {string} outputPath
 *   Path to directory where generated output are saved.
 */
function copyAssetDirectoriesToOutput(book, outputPath) {
  if (!Array.isArray(book.meta.assetDirectoryNames)) {
    return;
  }

  console.log("Copying asset directories...");

  for (let assetDirectoryName of book.meta.assetDirectoryNames) {
    let sourceAssetDirectoryPath = path.resolve(book.projectDirPath, assetDirectoryName);
    let outputAssetDirectoryPath = path.resolve(outputPath, assetDirectoryName);

    if (path.basename(sourceAssetDirectoryPath) !== assetDirectoryName) {
      throw new Error(`Invalid asset directory name '${assetDirectoryName}'.`);
    }

    console.log("  " + outputAssetDirectoryPath);

    fs.removeSync(outputAssetDirectoryPath);
    fs.copySync(sourceAssetDirectoryPath, outputAssetDirectoryPath);
  }
}


module.exports = copyAssetDirectoriesToOutput;
