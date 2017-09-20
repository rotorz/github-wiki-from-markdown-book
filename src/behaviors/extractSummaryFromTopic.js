// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const MarkdownIt = require("markdown-it");


const md = new MarkdownIt();


/**
 * Extracts summary paragraph from start of topic text.
 *
 * @param {string} topicText
 *   Topic text in markdown format.
 */
function extractSummaryFromTopic(topicText) {
  let tokens = md.parse(topicText, {});

  // Extract summary from paragraph following topic heading.
  let paragraphOpenTokenIndex = tokens.findIndex(
      (token, i) => token.type === "paragraph_open" && token.tag === "p");
  if (paragraphOpenTokenIndex === 0) {
    return tokens[1].content;
  }

  return "";
}


module.exports = extractSummaryFromTopic;
