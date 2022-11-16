#!/usr/bin/env node
import {
  binary,
  command,
  flag,
  positional,
  restPositionals,
  run,
} from "cmd-ts";
import { File } from "cmd-ts/batteries/fs";
import { version as pkgVersion } from "../package.json";
import { fromFile } from "./img-cat";

const cmd = command({
  name: "img-cat",
  description: "display images in the terminal",
  version: pkgVersion,
  args: {
    firstFile: positional({
      type: File,
    }),
    otherFiles: restPositionals({
      type: File,
    }),
    noPadding: flag({
      long: "no-padding",
      short: "n",
      description: "display image without any padding",
    }),
    trueColor: flag({
      long: "true-color",
      short: "t",
      description: "display image using true color (24-bit)",
    }),
  },
  async handler({ firstFile, otherFiles, noPadding, trueColor }) {
    const files = [firstFile, ...otherFiles];
    for (const filename of files) {
      const str = await fromFile(filename, {
        padding: !noPadding,
        trueColor: trueColor,
      });
      console.log(str);
    }
  },
});

run(binary(cmd), process.argv);
