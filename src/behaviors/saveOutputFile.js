// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const fs = require("fs-extra");
const path = require("path");


/**
 * Saves output file at the given path and creates the path if it doesn't already exist.
 *
 * @param {string} filePath
 *   Output file path.
 * @param {string} text
 *   Text that is to be saved to the output file.
 */
function saveOutputFile(filePath, text) {
  fs.ensureDirSync(path.dirname(filePath));
  fs.writeFileSync(filePath, text, "utf8");
}


module.exports = saveOutputFile;
