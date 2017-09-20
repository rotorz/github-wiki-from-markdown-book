// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const url = require("url");

const renderTopicListing = require("./renderTopicListing");
const renderBreadcrumbs = require("./renderBreadcrumbs");
const renderPagination = require("./renderPagination");


/**
 * Render topic into Github markdown wiki format.
 *
 * Example output:
 *
 * ```markdown
 * <sup>[[Home]] | [[Tile Systems]] | [[Creating a Tile System]]</sup>
 *
 * Presets make it easy to reuse parameters that are commonly used when creating tile
 * systems. Saved presets can be accessed from the **Preset** popup field.
 *
 *
 * <br/>[[&lt; Previous Page|Creating a Tile System]] | [[Next Page &gt;|Creating a Preset]]
 *
 *
 * ---
 *
 * #### Related Topics:
 *
 * - **[[Creating a Brush]]**
 *   Brushes can be created using the **Create Brush / Tileset** window.
 *
 *
 * ---
 *
 * #### Child Topics:
 *
 * - **[[Creating a Preset]]**<br/>
 *   The parameters used to create a tile system can be saved into a preset which can
 *   later be reused when creating a tile system.
 *
 * - **[[Modifying a Preset]]**<br/>
 *   An existing preset can be modified when creating a tile system. Modifications can be
 *   then be saved for future re-use if desired.
 *
 * - **[[Deleting a Preset]]**<br/>
 *   An unwanted preset can be deleted using the **Create Tile System** window by
 *   selecting it and clicking the delete button.
 *
 *
 * <sub>Source: [topics/Tile-System-Creation-Presets.md](https://github.com/kruncher/test/blob/master/docs/topics/Tile-System-Creation-Presets.md)</sub>
 * ```
 *
 * @param {Book} book
 *   The book that is to be built.
 * @param {object} topic
 *
 * @returns {string}
 *   Rendered topic in Github wiki markdown format.
 */
function renderTopic(book, topic) {
  let relatedTopicsListing = "";
  let relatedTopicReferences = book.topicReferences.getRelatedTopics(topic.source);
  if (relatedTopicReferences.length > 0) {
    let relatedTopics = relatedTopicReferences.map(ref => book.topicMap.get(ref));
    relatedTopicsListing = renderTopicListing("Related Topics", relatedTopics);
  }

  let childTopicsListing = "";
  if (topic.children.length > 0) {
    childTopicsListing = renderTopicListing("Child Topics", topic.children);
  }

  let sourceReference = "";
  if (typeof book.meta.sourceBaseUrl === "string") {
    let projectRelativePath = book.getPathRelativeToProjectDir(topic.source);
    let sourceReferenceUrl = url.resolve(book.meta.sourceBaseUrl, projectRelativePath);
    sourceReference = `\n<sub>Source: [${projectRelativePath}](${sourceReferenceUrl})</sub>\n`;
  }

  let pagination = renderPagination(topic)
  if (pagination !== "") {
    pagination = `\n\n<br/>${pagination}\n`;
  }

  return ""
      + renderBreadcrumbs(topic)
      + topic.text
      + pagination
      + relatedTopicsListing
      + childTopicsListing
      + "\n"
      + sourceReference;
}


module.exports = renderTopic;
