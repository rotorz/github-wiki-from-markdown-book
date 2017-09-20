// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const path = require("path");

const loadTopicFile = require("./behaviors/loadTopicFile");
const TopicReferenceMap = require("./TopicReferenceMap");


/**
 * Data structure representing a book.
 */
class Book {

  /**
   * Initializes a new instance of the `Book` class.
   *
   * @param {string} projectDirPath
   *   Path to the book's project directory.
   * @param {object} meta
   *   The meta data that defines the book along with its bound topics.
   */
  constructor(projectDirPath, meta) {
    this.projectDirPath = projectDirPath;

    this.meta = Object.assign(Book.getDefaultMeta(), meta || {});

    this.specialTopicMap = new Map();
    this.specialTopicList = [];
    this.topicMap = new Map();
    this.topicList = [];
    this.topicReferences = new TopicReferenceMap();
    this.tocRootTopic = null;
    this.children = [];

    let referenceTable = this._normalizeReferenceTable(this.meta.referenceTable);
    this.topicReferences.addReferencesFromTable(referenceTable);
  }


  /**
   * Gets the default fallback meta data of a `Book`.
   */
  static getDefaultMeta() {
    return {
      title: "Untitled",
      author: "Unknown Author",

      tocRootTopic: null,
      tocDepth: 2,

      topics: [],
      referenceTable: [],
    };
  }


  /**
   * Determines whether a file path exists within the book's project directory.
   *
   * @param {string} filePath
   *   File path.
   *
   * @returns {boolean}
   *   `true` if file path is within project directory; otherwise, `false`.
   */
  isFileInsideProjectDir(filePath) {
    filePath = path.resolve(filePath);
    return filePath.startsWith(this.projectDirPath);
  }

  /**
   * Get path relative from the book's project directory.
   *
   * Resulting path has URL safe forward slashes.
   *
   * @param {string} filePath
   *   File path.
   *
   * @returns {string}
   *   Path relative to the book's project directory.
   */
  getPathRelativeToProjectDir(filePath) {
    let absoluteFilePath = path.resolve(this.projectDirPath, filePath);
    let relativeFilePath = path.relative(this.projectDirPath, absoluteFilePath);
    return relativeFilePath.replace("\\", "/");
  }

  /**
   * Gets output file path of a topic.
   *
   * @param {object} topic
   *   The topic.
   * @param {string} outputPath
   *   Output path of build.
   *
   * @returns {string}
   *   Path to topic output file.
   */
  getOutputFilePath(topic, outputPath) {
    return path.resolve(outputPath, path.basename(topic.source));
  }


  /**
   * Loads and links all of the book's topic files.
   */
  loadTopicFiles() {
    this._loadTopicFiles(this.meta.special, this.specialTopicMap, this.specialTopicList);
    this._loadTopicFiles(this.meta.topics, this.topicMap, this.topicList);

    this._linkTocRootTopic();
    this._linkTopics(this.specialTopicMap, this.specialTopicList);
    this._linkTopics(this.topicMap, this.topicList);

    this.children = this.topicList.filter(topic => !topic.parent);
  }


  /**
   * Gets list of child topics for a given root topic.
   *
   * @param {object|undefined|null} rootTopic
   *   The root topic; assumes root of book when not specified.
   */
  getChildTopics(rootTopic) {
    return Array.from((rootTopic || this).children);
  }


  _normalizeReferenceTable(referenceTable) {
    return referenceTable.map(entry => ({
      type: entry.type,
      source: entry.source.map(ref => path.resolve(this.projectDirPath, ref)),
      target: entry.target.map(ref => path.resolve(this.projectDirPath, ref))
    }));
  }


  _loadTopicFiles(topicMetaListing, topicMap, topicList) {
    this._walkTopicMeta(topicMetaListing, this.meta, (topicMeta, parentTopicMeta) => {
      let topic = this._loadTopicFile(topicMeta, parentTopicMeta);
      topicMap.set(topic.source, topic);
      topicList.push(topic);
    });
  }

  _walkTopicMeta(topics, parentTopic, callback) {
    for (let topic of topics) {
      callback(topic, parentTopic);

      if (Array.isArray(topic.topics)) {
        this._walkTopicMeta(topic.topics, topic, callback);
      }
    }
  }

  _loadTopicFile(topicMeta, parentTopicMeta) {
    // Bail if the topic content has already been read!
    if (this.topicMap.has(topicMeta.source)) {
      throw new Error(`Topic '${topicMeta.source}' already defined.`);
    }

    let topicFilePath = path.resolve(this.projectDirPath, topicMeta.source);
    let topic = loadTopicFile(topicFilePath);
    topic.meta = topicMeta;

    if (typeof parentTopicMeta.source === "string") {
      topic.parent = path.resolve(this.projectDirPath, parentTopicMeta.source);
    }

    topic.children = (topicMeta.topics || []).map(
        childTopicMeta => path.resolve(this.projectDirPath, childTopicMeta.source)
      );

    return topic;
  }


  _linkTocRootTopic() {
    if (typeof this.meta.tocRootTopic === "string") {
      let tocRootTopic = path.resolve(this.projectDirPath, this.meta.tocRootTopic);
      this.tocRootTopic = this.topicMap.get(tocRootTopic);
    }
    else {
      this.tocRootTopic = this;
    }
  }

  _linkTopics(topicMap, topicList) {
    for (let i = 0; i < topicList.length; ++i) {
      let topic = topicList[i];

      topic.parent = topicMap.get(topic.parent);
      topic.children = topic.children.map(ref => topicMap.get(ref));

      if (i > 0) {
        topic.previous = topicList[i - 1];
      }
      if (i < topicList.length - 1) {
        topic.next = topicList[i + 1];
      }
    }
  }

}



module.exports = Book;
