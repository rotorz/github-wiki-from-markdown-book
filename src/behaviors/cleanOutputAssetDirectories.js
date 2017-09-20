// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const fs = require("fs-extra");
const path = require("path");


/**
 * Removes asset directories that were copied to the output directory.
 *
 * @param {Book} book
 *   The book that is to be cleaned.
 * @param {string} outputPath
 *   Path to directory where generated output are saved.
 */
function cleanOutputAssetDirectories(book, outputPath) {
  for (let assetDirectoryName of book.meta.assetDirectoryNames) {
    let sourceAssetDirectoryPath = path.resolve(book.projectDirPath, assetDirectoryName);
    let outputAssetDirectoryPath = path.resolve(outputPath, assetDirectoryName);

    if (path.basename(sourceAssetDirectoryPath) !== assetDirectoryName) {
      throw new Error(`Invalid asset directory name '${assetDirectoryName}'.`);
    }

    console.log(`  Removing asset directory '${outputAssetDirectoryPath}'...`);

    fs.removeSync(outputAssetDirectoryPath);
  }
}


module.exports = cleanOutputAssetDirectories;
