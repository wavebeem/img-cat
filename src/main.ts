#!/usr/bin/env node
// TODO: https://github.com/Schniz/cmd-ts
import minimist from "minimist";
import { version as pkgVersion } from "../package.json";
import { fromFile } from "./img-cat";

const args = process.argv.slice(2);
const argv = minimist(args, {
  alias: {
    help: ["h", "?"],
    version: ["v"],
    "no-padding": ["n"],
  },
  boolean: ["no-padding"],
});

function usage(): never {
  console.log(`\
 usage: img-cat [options] [--] [images]
   -h, --help, -?       display this help text
   -v, --version        display version string
   -n, --no-padding     do not pad image output
   --copyright          display copyright information
`);
  process.exit();
}

function version(): never {
  console.log(pkgVersion);
  process.exit();
}

function copyright(): never {
  console.log(`
Copyright (c) 2014-${new Date().getFullYear()} Brian Mock
MIT license <http://opensource.org/licenses/MIT>
There is NO WARRANTY, to the extent permitted by law.
`);
  process.exit();
}

async function main() {
  const paths = [...(argv._ || []), ...(argv["--"] || [])];
  if (argv.version) {
    version();
  }
  if (argv.copyright) {
    copyright();
  }
  if (argv.help || paths.length === 0) {
    usage();
  }
  for (const p of paths) {
    const str = await fromFile(p, {
      padding: !(argv.n || argv["no-padding"]),
      trueColor: false,
    });
    console.log(str);
  }
}

main();
