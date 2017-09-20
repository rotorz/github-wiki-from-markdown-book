// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const path = require("path");

const constants = require("../constants");
const copyAssetDirectoriesToOutput = require("./copyAssetDirectoriesToOutput");
const renderTocListing = require("./renderTocListing");
const renderTopic = require("./renderTopic");
const saveOutputFile = require("./saveOutputFile");
const substitutePlaceholders = require("./substitutePlaceholders");


/**
 * Builds output of book.
 *
 * @param {Book} book
 *   The book that is to be built.
 * @param {string} outputPath
 *   Path to directory where generated output are saved.
 */
function build(book, outputPath) {
  book.loadTopicFiles();

  let tocRootChildren = book.getChildTopics(book.tocRootTopic);

  let variables = {
    "{{FULL_TOC}}": renderTocListing(tocRootChildren, 999999),
    "{{TOC}}": renderTocListing(tocRootChildren, book.meta.tocDepth - 1)
  };

  copyAssetDirectoriesToOutput(book, outputPath);
  generateSpecialOutputFiles(book, variables, outputPath);
  generateTopicOutputFiles(book, variables, outputPath);
}


function generateSpecialOutputFiles(book, variables, outputPath) {
  console.log("Generating special output files...");

  for (let topic of book.specialTopicList) {
    let outputFilePath = book.getOutputFilePath(topic, outputPath);
    let outputText = postprocessGeneratedOutput(topic.text, variables);
    saveOutputFile(outputFilePath, outputText);
  }
}

function generateTopicOutputFiles(book, variables, outputPath) {
  console.log("Generating topic output files...");

  for (let topic of book.topicList) {
    let renderedTopicText = renderTopic(book, topic);
    let outputFilePath = book.getOutputFilePath(topic, outputPath);
    let outputText = postprocessGeneratedOutput(renderedTopicText, variables);
    saveOutputFile(outputFilePath, outputText);
  }
}


function postprocessGeneratedOutput(outputText, variables) {
  return constants.GENERATED_OUTPUT_COMMENT + "\n\n"
      + substitutePlaceholders(outputText, variables);
}


module.exports = build;
