// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


const program = require("commander");


program
  .version(require("../package").version)
  .command("build", "process source content and build output")
  .command("clean", "clean previous build output")
  .parse(process.argv);
