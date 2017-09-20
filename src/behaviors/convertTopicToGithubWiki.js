// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


/**
 * Converts topic text from regular markdown into Github wiki style markdown.
 *
 * @param {string} topicText
 *   Topic text in markdown format.
 */
function convertTopicToGithubWiki(topicText) {
  // Convert to Github Wiki style image embeds.
  topicText = topicText.replace(
    /!\[([^\]]*)\]\((\.\.?\/)?([^)]+)\)/g,
    "[[$3|$1]]"
  );

  // Github wiki doesn't support '.md' file extension in relative links.
  topicText = topicText.replace(
    /^(\[[^\]]*\]:)\s*(\.\/.+?)\.md\s*$/gm,
    "$1 $2"
  );

  return topicText;
}


module.exports = convertTopicToGithubWiki;
