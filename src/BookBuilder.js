// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const MarkdownIt = require("markdown-it");
const fs = require("fs-extra");
const path = require("path");
const url = require("url");
const yaml = require("js-yaml");

const constants = require("./constants");


const md = new MarkdownIt();


class BookBuilder {

  static createFromYamlFile(filePath) {
    var builder = new BookBuilder();

    builder.bookFilePath = path.resolve(filePath);
    builder.bookDir = path.join(path.dirname(builder.bookFilePath), "/");

    builder.meta = yaml.safeLoad(fs.readFileSync(builder.bookFilePath, "utf8"));
    builder.meta.title = builder.meta.title || "Untitled";
    builder.meta.author = builder.meta.author || "Unknown Author";
    builder.meta.topics = builder.meta.topics || [];

    if (typeof builder.meta.tocDepth !== "number") {
      builder.meta.tocDepth = 2;
    }
    builder.meta.toctitle = builder.meta.toctitle || "Table of Contents";

    builder.topicContent = new Map();
    builder.referenceMap = new Map();
    builder.linearNavigation = [];
    return builder;
  }



  walkTopics(options) {
    options.rootTopic = options.rootTopic || {};

    this._walkTopicsHelper(this.meta.topics, options.rootTopic, options.callback);
  }

  _walkTopicsHelper(topics, parentTopic, callback) {
    for (let topic of topics) {
      callback(topic, parentTopic);

      if (Array.isArray(topic.topics)) {
        this._walkTopicsHelper(topic.topics, topic, callback);
      }
    }
  }



  build(outputPath) {
    this.prefilterTopics();
    this.prepareReferenceMap();
    this.prepareLinearNavigation();
    this.readTopicContentFiles();
    this.generateTocListing();
    this.generateOutputFiles(outputPath);
  }


  normalizePathRelativeToBook(sourcePath) {
    sourcePath = path.resolve(this.bookDir, sourcePath);
    return path.relative(this.bookDir, sourcePath).replace("\\", "/");
  }



  prefilterTopics() {
    if (typeof this.meta.tocRootTopic === "string") {
      this.meta.tocRootTopic = this.normalizePathRelativeToBook(this.meta.tocRootTopic);
    }

    this.walkTopics({
      callback: this.prefilterTopic.bind(this)
    });
  }

  prefilterTopic(topic) {
    topic.source = path.resolve(this.bookDir, topic.source);
    topic.sourceRelative = this.normalizePathRelativeToBook(topic.source);

    if (!topic.source.startsWith(this.bookDir)) {
      fatalError(`Source path '${topic.source}' is outside book project directory.`);
    }
    if (!fs.existsSync(topic.source)) {
      fatalError(`Source path '${topic.source}' does not exist.`);
    }
  }



  prepareReferenceMap() {
    if (!Array.isArray(this.meta.referenceTable)) {
      return;
    }

    for (let entry of this.meta.referenceTable) {
      entry.type = entry.type || "normal";

      let shouldMapSourceToTarget = (entry.type === "normal" || entry.type === "sourceonly");
      let shouldMapTargetToSource = (entry.type === "normal" || entry.type === "targetonly");

      for (let sourceReference of entry.source) {
        for (let targetReference of entry.target) {
          if (shouldMapSourceToTarget) {
            this.addReferenceMapping(sourceReference, targetReference);
          }
          if (shouldMapTargetToSource) {
            this.addReferenceMapping(targetReference, sourceReference);
          }
        }
      }
    }
  }

  addReferenceMapping(sourceReference, targetReference) {
    sourceReference = this.normalizePathRelativeToBook(sourceReference);
    targetReference = this.normalizePathRelativeToBook(targetReference);

    let mappings = this.referenceMap.get(sourceReference);
    if (!mappings) {
      mappings = new Set();
      this.referenceMap.set(sourceReference, mappings);
    }

    mappings.add(targetReference);
  }

  getRelatedTopicReferences(sourceReference) {
    let targetReferences = this.referenceMap.get(sourceReference);
    return !!targetReferences
      ? Array.from(targetReferences).sort()
      : [];
  }



  prepareLinearNavigation() {
    this.walkTopics({
      callback: topic => this.linearNavigation.push(topic.sourceRelative)
    });
  }



  readTopicContentFiles() {
    this.walkTopics({
      rootTopic: this.meta,
      callback: this.readTopicContentFile.bind(this)
    });
  }

  readTopicContentFile(topic, parentTopic) {
    // Bail if the topic content has already been read!
    if (this.topicContent.has(topic.source)) {
      fatalError(`Topic '${topic.source}' already defined.`);
    }

    let raw = fs.readFileSync(topic.source, "utf8");

    let content = this.parseTopicContent(raw);
    content.title = path.basename(topic.sourceRelative, ".md").replace(/-/g, " ");
    content.sourceRelative = topic.sourceRelative;
    content.source = topic.source;
    content.topics = topic.topics;

    // Add parent reference.
    content.parentTopic = parentTopic;
    content.parentTopicReference = parentTopic.sourceRelative;

    // Add previous and next page references.
    let thisTopicIndex = this.linearNavigation.indexOf(topic.sourceRelative);
    if (thisTopicIndex !== -1) {
      if (thisTopicIndex > 0) {
        content.previousTopicReference = this.linearNavigation[thisTopicIndex - 1];
      }
      if (thisTopicIndex < this.linearNavigation.length - 1) {
        content.nextTopicReference = this.linearNavigation[thisTopicIndex + 1];
      }
    }

    this.topicContent.set(topic.sourceRelative, content);
  }



  parseTopicContent(raw) {
    // Convert to Github Wiki style image embeds.
    raw = raw.replace(
      /!\[([^\]]*)\]\((\.\.?\/)?([^)]+)\)/g,
      "[[$3|$1]]"
    );

    // Github wiki doesn't support '.md' file extension in relative links.
    raw = raw.replace(
      /^(\[[^\]]*\]:)\s*(\.\/.+?)\.md\s*$/gm,
      "$1 $2"
    );


    let result = { summary: null, text: raw };
    let tokens = md.parse(raw, {});

    // Extract summary from paragraph following topic heading.
    let paragraphOpenTokenIndex = tokens.findIndex(
        (token, i) => token.type === "paragraph_open" && token.tag === "p");
    if (paragraphOpenTokenIndex === 0) {
      result.summary = tokens[1].content;
    }

    return result;
  }



  generateOutputFiles(outputPath) {
    this.generateAssetDirectories(outputPath);
    this.generateSpecialOutputFiles(outputPath);
    this.generateTopicOutputFiles(outputPath);
  }


  generateAssetDirectories(outputPath) {
    if (!Array.isArray(this.meta.assetDirectoryNames)) {
      return;
    }

    console.log("Copying asset directories...");

    for (let assetDirectoryName of this.meta.assetDirectoryNames) {
      let sourceAssetDirectoryPath = path.resolve(this.bookDir, assetDirectoryName);
      let outputAssetDirectoryPath = path.resolve(outputPath, assetDirectoryName);

      if (path.basename(sourceAssetDirectoryPath) !== assetDirectoryName) {
        fatalError(`Invalid asset directory name '${assetDirectoryName}'.`);
      }

      console.log("  " + outputAssetDirectoryPath);

      fs.removeSync(outputAssetDirectoryPath);
      fs.copySync(sourceAssetDirectoryPath, outputAssetDirectoryPath);
    }
  }

  generateSpecialOutputFiles(outputPath) {
    console.log("Generating special output files...");

    for (let specialEntry of this.meta.special) {
      let specialSourcePath = path.resolve(this.bookDir, specialEntry.source);
      let specialRelativePath = this.normalizePathRelativeToBook(specialSourcePath);
      let specialOutputPath = path.resolve(outputPath, path.basename(specialRelativePath));

      let specialSourceText = fs.readFileSync(specialSourcePath, "utf8");
      this.generateSpecialOutput(specialSourceText, specialOutputPath);
    }
  }

  generateTopicOutputFiles(outputPath) {
    console.log("Generating topic output files...");

    for (let [source, content] of this.topicContent) {
      this.generateTopicOutputFile(source, content, outputPath);
    }
  }


  generateTopicOutputFile(source, content, outputPath) {
    let generatedPath = path.resolve(outputPath, path.basename(source));


    let breadcrumbs = "";
    var activeBreadcrumb = content.parentTopic;
    while (!!activeBreadcrumb) {
      let crumbContent = this.topicContent.get(activeBreadcrumb.sourceRelative);
      if (!crumbContent) {
        break;
      }

      let crumb = `[[${crumbContent.title}]]`;
      if (breadcrumbs !== "") {
        crumb += " | ";
      }

      breadcrumbs = crumb + breadcrumbs;
      activeBreadcrumb = crumbContent.parentTopic;
    }
    if (breadcrumbs != "") {
      breadcrumbs = `<sup>${breadcrumbs}</sup>\n\n`;
    }


    let pagination = "";
    if (typeof content.previousTopicReference === "string") {
      let previousContent = this.topicContent.get(content.previousTopicReference);
      pagination = `[[&lt; Previous Page|${previousContent.title}]]`;
    }
    if (typeof content.nextTopicReference === "string") {
      if (pagination !== "") {
        pagination += " | ";
      }
      let nextContent = this.topicContent.get(content.nextTopicReference);
      pagination += `[[Next Page &gt;|${nextContent.title}]]`;
    }
    if (pagination !== "") {
      pagination = `\n\n<br/>${pagination}\n`;
    }


    let relatedTopicsListing = "";
    let relatedTopicReferences = this.getRelatedTopicReferences(content.sourceRelative);
    if (relatedTopicReferences.length > 0) {
      relatedTopicsListing = this.generateAssociatedTopicListing("Related Topics", relatedTopicReferences);
    }

    let childTopicsListing = "";
    if (Array.isArray(content.topics) && content.topics.length > 0) {
      let childTopicReferences = content.topics.map(topic => topic.sourceRelative);
      childTopicsListing = this.generateAssociatedTopicListing("Child Topics", childTopicReferences);
    }


    let sourceReference = "";
    if (typeof this.meta.sourceBaseUrl === "string") {
      let sourceReferenceUrl = url.resolve(this.meta.sourceBaseUrl, content.sourceRelative);
      sourceReference = `\n<sub>Source: [${content.sourceRelative}](${sourceReferenceUrl})</sub>\n`;
    }


    let generatedContent = constants.GENERATED_OUTPUT_COMMENT + "\n\n"
        + breadcrumbs
        + this.substitutePlaceholders(content.text)
        + pagination
        + relatedTopicsListing
        + childTopicsListing
        + "\n"
        + sourceReference;

    fs.ensureDirSync(path.dirname(generatedPath));
    fs.writeFileSync(generatedPath, generatedContent, "utf8");
  }

  generateAssociatedTopicListing(heading, topics) {
    let listing = `\n\n---\n\n#### ${heading}:\n`;

    for (let topic of topics) {
      let topicContent = this.topicContent.get(topic);
      let topicSummary = "";

      if (typeof topicContent.summary === "string") {
        topicSummary = `<br/>\n  ${topicContent.summary}`;
      }

      listing += `\n- **[[${topicContent.title}]]**${topicSummary}\n`;
    }

    return listing;
  }


  generateSpecialOutput(sourceText, outputPath) {
    let outputText = this.substitutePlaceholders(sourceText);

    fs.ensureDirSync(path.dirname(outputPath));
    fs.writeFileSync(outputPath, outputText, "utf8");
  }


  substitutePlaceholders(markdownText) {
    let wikiMarkdown = markdownText;

    // Substitute {{TOC}} and {{FULL_TOC}}.
    wikiMarkdown = wikiMarkdown
      .replace("{{FULL_TOC}}", this.fullTocListing)
      .replace("{{TOC}}", this.tocListing);

    return wikiMarkdown;
  }



  generateTocListing() {
    this.fullTocListing = this._generateTocListingHelper("", this.tocRoot.topics, 999999);
    this.tocListing = this._generateTocListingHelper("", this.tocRoot.topics, this.meta.tocDepth - 1);
  }

  get tocRoot() {
    let root = this.meta;

    if (typeof this.meta.tocRootTopic === "string") {
      root = this.topicContent.get(this.meta.tocRootTopic);
    }

    return root;
  }

  _generateTocListingHelper(padding, topics, maximumDepth) {
    let output = "";
    let innerPadding = padding + "  ";

    for (let topic of topics) {
      if (topic.tocExclude === true) {
        continue;
      }

      let content = this.topicContent.get(topic.sourceRelative);
      output += `${padding}- [[${content.title}]]\n`;

      if (topic.tocExcludeChildren !== true) {
        if (maximumDepth > 0 && Array.isArray(topic.topics)) {
          output += this._generateTocListingHelper(innerPadding, topic.topics, maximumDepth - 1);
        }
      }
    }

    return output;
  }

}



function fatalError(message) {
  console.error("Error: " + message);
  process.exit(1);
}



module.exports = BookBuilder;
