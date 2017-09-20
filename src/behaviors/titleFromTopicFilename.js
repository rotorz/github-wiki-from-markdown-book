// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const path = require("path");


/**
 * Extracts title from topic file path.
 *
 * Usage example:
 *
 * ```javascript
 * let topicTitle = titleFromTopicFilename("./topics/My-Topic-Title.md");
 *
 * // "My Topic Title"
 * ```
 *
 * @param {string} filePath
 *   Path of topic file.
 *
 * @returns {string}
 *   Topic title.
 */
function titleFromTopicFilename(filePath) {
  return path.basename(filePath, ".md").replace(/-/g, " ");
}


module.exports = titleFromTopicFilename;
