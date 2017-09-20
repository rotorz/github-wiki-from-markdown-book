// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


/**
 * Renders listing of topics in Github wiki markdown format.
 *
 * Example output:
 *
 * ```markdown
 * #### Related Topics
 *
 * - **[[Installation]]<br/>
 *   The package can be installed using the npm tool.
 *
 * - **[[Updating]]<br/>
 *   The package can be updated using the npm tool.
 * ```
 *
 * @param {string} heading
 *   Heading text of the listing.
 * @param {array} topics
 *   Array of topics in the listing.
 *
 * @returns {string}
 *   Topic listing in Github wiki markdown format.
 */
function renderTopicListing(heading, topics) {
  let listing = `\n\n---\n\n#### ${heading}:\n`;
  for (let topic of topics) {
    let summaryText = (topic.summary != "")
        ? `<br/>\n  ${topic.summary}`
        : "";
    listing += `\n- **[[${topic.title}]]**${summaryText}\n`;
  }
  return listing;
}


module.exports = renderTopicListing;
