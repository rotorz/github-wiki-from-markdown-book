// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


/**
 * Renders breadcrumb navigation of a topic.
 *
 * Example output:
 *
 * ```markdown
 * <sup>[[Home]] | [[Getting Started]]</sup>
 * ```
 *
 * @param {object} topic
 *
 * @returns {string}
 *   Breadcrumb navigation in Github wiki markdown format.
 */
function renderBreadcrumbs(topic) {
  let breadcrumbs = "";

  var parentTopic = topic.parent;
  while (!!parentTopic) {
    let crumb = `[[${parentTopic.title}]]`;
    if (breadcrumbs !== "") {
      crumb += " | ";
    }

    breadcrumbs = crumb + breadcrumbs;
    parentTopic = parentTopic.parent;
  }

  if (breadcrumbs != "") {
    breadcrumbs = `<sup>${breadcrumbs}</sup>\n\n`;
  }

  return breadcrumbs;
}


module.exports = renderBreadcrumbs;
