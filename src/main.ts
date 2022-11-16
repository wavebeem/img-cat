#!/usr/bin/env node
import {
  command,
  positional,
  restPositionals,
  flag,
  run,
  binary,
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
  },
  async handler(args) {
    const files = [args.firstFile, ...args.otherFiles];
    for (const filename of files) {
      const str = await fromFile(filename, {
        padding: !args.noPadding,
        trueColor: false,
      });
      console.log(str);
    }
  },
});

run(binary(cmd), process.argv);
