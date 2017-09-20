// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


/**
 * An object that maps topic references.
 *
 * Associations can be made between topics such that related topics can be automatically
 * listed when rendering a topic.
 *
 * A reference table can define 3 types of association:
 */
class TopicReferenceMap {

  /**
   * Initializes a new instance of the `TopicReferenceMap` class.
   */
  constructor() {
    this._map = new Map();
  }


  /**
   * Adds topic references from a references table.
   *
   * Each entry of a reference table has the following fields:
   *
   * - `type` (optional, default = "normal") - Defines the type of reference:
   *
   *   - **normal** - **Source** and **Target** topics reference in both directions.
   *
   *   - **sourceonly** - **Source** references the **Target** topic.
   *
   *   - **targetonly** - **Target** references the **Source** topic.
   *
   * - `source` (string[]) - List of source topic paths.
   *
   * - `target` (string[]) - List of target topic paths.
   *
   * @param {array} referenceTable
   *   An array of references.
   */
  addReferencesFromTable(referenceTable) {
    if (!Array.isArray(referenceTable)) {
      throw new TypeError("argument 'referenceTable' must be an array");
    }

    for (let entry of referenceTable) {
      let type = entry.type || "normal";

      let shouldMapSourceToTarget = (type === "normal" || type === "sourceonly");
      let shouldMapTargetToSource = (type === "normal" || type === "targetonly");

      for (let sourceReference of entry.source) {
        for (let targetReference of entry.target) {
          if (shouldMapSourceToTarget) {
            this.addReference(sourceReference, targetReference);
          }
          if (shouldMapTargetToSource) {
            this.addReference(targetReference, sourceReference);
          }
        }
      }
    }
  }

  /**
   * Adds a reference from a source topic to a target topic.
   *
   * @param {string} sourceReference
   *   Path of source topic.
   * @param {string} targetReference
   *   Path of target topic.
   */
  addReference(sourceReference, targetReference) {
    if (typeof sourceReference !== "string") {
      throw new TypeError("argument 'sourceReference' must be a string");
    }
    if (typeof targetReference !== "string") {
      throw new TypeError("argument 'targetReference' must be a string");
    }

    // Avoid having a topic be related to itself.
    if (sourceReference === targetReference) {
      return;
    }

    let mappings = this._getTopicReferenceSet(sourceReference);
    mappings.add(targetReference);
  }

  /**
   * Gets an array of topics that are related to a requests source topic.
   *
   * @param {string} sourceReference
   *   Path of the source topic.
   *
   * @returns {string[]}
   *   Array of related topics sorted by title.
   */
  getRelatedTopics(sourceReference) {
    let targetReferences = this._map.get(sourceReference);
    return !!targetReferences
      ? Array.from(targetReferences).sort()
      : [];
  }


  _getTopicReferenceSet(sourceReference) {
    let set = this._map.get(sourceReference);
    if (!set) {
      set = new Set();
      this._map.set(sourceReference, set);
    }
    return set;
  }

}



module.exports = TopicReferenceMap;
