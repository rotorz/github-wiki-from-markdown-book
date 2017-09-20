// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const Book = require("../Book");


/**
 * Loads book from YAML data file.
 *
 * @param {string} filePath
 *   Path to the book YAML file.
 *
 * @returns {Book}
 */
function loadBookFromYamlFile(filePath) {
  filePath = path.resolve(filePath);

  let projectDirPath = path.join(path.dirname(filePath), "/");
  let meta = yaml.safeLoad(fs.readFileSync(filePath, "utf8"));
  let book = new Book(projectDirPath, meta);
  book.filePath = filePath;

  return book;
}


module.exports = loadBookFromYamlFile;
