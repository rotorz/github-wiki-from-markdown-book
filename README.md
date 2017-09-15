# github-wiki-from-markdown-book

Loads and collates markdown topic files using a YAML encoded book that organizes the
topics into a book. This is sort of like a highly watered down version of DITA.


## Installation

```sh
$ npm install --save-dev github-wiki-from-markdown-book
```


## Usage

```sh
$ github-wiki-from-markdown-book --source=markdown-book.yaml --output=./wiki
```

| Argument       | Description                                                           |
|----------------|:----------------------------------------------------------------------|
| `--source`     | Path to the YAML data file that composes the markdown book.           |
| `--output`     | Output path for generated Github wiki pages.                          |
| `--help`       | Shows usage information.                                              |


## Example book.yaml

```yaml
title: User Guide for Barry's Useful Toolkit
author: Barry Jones

topics:
  - source: ./getting-started.md
    topics:
      - source: ./introduction.md
      - source: ./installation.md
      - source: ./software-updates.md
  - source: ./user-interface.md
    topics:
      - source: ./main-window.md
        topics:
          - source: ./toolbar.md
          - source: ./status-panel.md
          - source: ./viewports.md
      - source: ./create-viewport.md

references:
  - type: normal
    sources:
      - ./viewports.md
    targets:
      - ./create-viewport.md
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
