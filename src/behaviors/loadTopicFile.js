// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const fs = require("fs");

const convertTopicToGithubWiki = require("./convertTopicToGithubWiki");
const extractSummaryFromTopic = require("./extractSummaryFromTopic");
const titleFromTopicFilename = require("./titleFromTopicFilename");


/**
 * Loads topic file.
 *
 * ## Topic members:
 *
 * - `source` (string) - Absolute path to the topic file.
 * - `title` (string) - Title of the topic.
 * - `summary` (string) - Summary text from start of topic in markdown format.
 * - `text` (string) - Topic text in markdown format.
 *
 * @param {string} filePath
 *   Absolute path to the topic file.
 *
 * @returns {object}
 *   An object representing the loaded topic.
 */
function loadTopicFile(filePath) {
  let topicText = fs.readFileSync(filePath, "utf8");
  topicText = convertTopicToGithubWiki(topicText);

  return {
    source: filePath,
    title: titleFromTopicFilename(filePath),
    summary: extractSummaryFromTopic(topicText),
    text: topicText
  };
}


module.exports = loadTopicFile;
