// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


/**
 * Substitutes placeholders with the given variable names.
 *
 * Usage example:
 *
 * ```javascript
 * let topicText = substitutePlaceholders("Meaning of life = {{ULTIMATE_MEANING}}", {
 *   "{{ULTIMATE_MEANING}}": 42
 * });
 *
 * // "Meaning of life = 42"
 * ```
 *
 * @param {string} topicText
 *   Input topic text that is to be processed.
 * @param {object} variables
 *   Associative array mapping placeholders to their values.
 *
 * @returns {string}
 *   Processed topic text.
 */
function substitutePlaceholders(topicText, variables) {
  for (let placeholder of Object.keys(variables)) {
    topicText = topicText.replace(placeholder, variables[placeholder]);
  }
  return topicText;
}


module.exports = substitutePlaceholders;
