# github-wiki-from-markdown-book

Loads and collates markdown topic files using a YAML encoded book that organizes the
topics into a book. This is sort of like a highly watered down version of DITA.

>
> **Important** - Implementation is currently rough and there are no unit tests yet.
>


## Installation

```sh
$ npm install --save-dev github-wiki-from-markdown-book
```


## Usage - build command

```sh
$ github-wiki-from-markdown-book build --source=markdown-book.yaml --output=./wiki
```

| Argument       | Description                                                           |
|----------------|:----------------------------------------------------------------------|
| `--input`      | Path to the YAML input file that composes the markdown book.          |
| `--output`     | Output path for generated Github wiki pages.                          |
| `--help`       | Shows usage information.                                              |


## Usage - clean command

```sh
$ github-wiki-from-markdown-book clean --output=./wiki
```

| Argument       | Description                                                           |
|----------------|:----------------------------------------------------------------------|
| `--output`     | Output path for generated Github wiki pages.                          |
| `--help`       | Shows usage information.                                              |


## Example book.yaml

```yaml
title: Example Book
author: Joe Bloggs


# Base URL for 'source' links in generated output.
# Note: Source links are not generated if this is not specified.
sourceBaseUrl: https://github.com/rotorz/github-wiki-from-markdown-book/blob/master/example-book/

# Relative path to topic that will be used as root node of generated TOC.
tocRootTopic: ./topics/Home.md
# Maximum depth for generated TOC.
tocDepth: 2


# List of asset directory names (these are copied to generated output).
assetDirectoryNames:
  - img


# List of special files - these get processed but are not treated as topics.
special:
  - source: ./special/_Footer.md
  - source: ./special/_Sidebar.md


# List of topics.
topics:
  # Chapter: Getting Started
  - source: ./topics/Getting-Started.md
    topics:
      # Sub-topic
      - source: ./topics/Introduction.md
      - source: ./topics/Installation.md
      - source: ./topics/Software-Updates.md

  # Chapter: User Interface
  - source: ./topics/User-Interface.md
    topics:
      # Sub-topics
      - source: ./topics/Main-Window.md
        topics:
          # Going deeper! sub-topics of "Main Window".
          - source: ./topics/Toolbar.md
          - source: ./topics/Status-Panel.md
          - source: ./topics/Viewports.md
      - source: ./topics/Create-Viewport.md


# Associates topics with one another to produce 'Related Topics' listings.
referenceTable:
  - type: sourceonly
    sources:
      - ./topics/Viewports.md
    targets:
      - ./topics/Create-Viewport.md
```


## Contribution Agreement

This project is licensed under the MIT license (see LICENSE). To be in the best
position to enforce these licenses the copyright status of this project needs to
be as simple as possible. To achieve this the following terms and conditions
must be met:

- All contributed content (including but not limited to source code, text,
  image, videos, bug reports, suggestions, ideas, etc.) must be the
  contributors own work.

- The contributor disclaims all copyright and accepts that their contributed
  content will be released to the public domain.

- The act of submitting a contribution indicates that the contributor agrees
  with this agreement. This includes (but is not limited to) pull requests, issues,
  tickets, e-mails, newsgroups, blogs, forums, etc.
