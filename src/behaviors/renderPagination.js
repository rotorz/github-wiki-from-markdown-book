// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


/**
 * Renders pagination navigation of a topic.
 *
 * Example output:
 *
 * ```markdown
 * [[&lt; Previous Page|Home]] | [[Next Page &gt;|Updating]]
 * ```
 *
 * @param {object} topic
 *
 * @returns {string}
 *   Pagination navigation in Github wiki markdown format.
 */
function renderPagination(topic) {
  let pagination = "";
  if (!!topic.previous) {
    pagination = `[[&lt; Previous Page|${topic.previous.title}]]`;
  }
  if (!!topic.next) {
    if (pagination !== "") {
      pagination += " | ";
    }
    pagination += `[[Next Page &gt;|${topic.next.title}]]`;
  }
  return pagination;
}


module.exports = renderPagination;
