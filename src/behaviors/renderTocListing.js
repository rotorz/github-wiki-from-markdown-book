// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


/**
 * Render table of contents listing.
 *
 * Example output:
 *
 * ```markdown
 * - [[Getting Started]]
 *   - [[Installation]]
 *   - [[Updating]]
 * ```
 *
 * @param {array} topicList
 *   List of topics in reading order.
 * @param {number} maximumDepth
 *   Maximum depth of entries.
 *
 * @returns {string}
 *   Table of contents in Github wiki markdown format.
 */
function renderTocListing(topicList, maximumDepth) {
  return renderTocListingHelper("", topicList, maximumDepth);
}


function renderTocListingHelper(padding, topicList, maximumDepth) {
  let output = "";
  let innerPadding = padding + "  ";

  for (let topic of topicList) {
    if (topic.meta.tocExclude === true) {
      continue;
    }

    output += `${padding}- [[${topic.title}]]\n`;

    if (topic.meta.tocExcludeChildren !== true) {
      if (maximumDepth > 0 && topic.children.length > 0) {
        output += renderTocListingHelper(innerPadding, topic.children, maximumDepth - 1);
      }
    }
  }

  return output;
}


module.exports = renderTocListing;
