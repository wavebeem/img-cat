import getPixels from "get-pixels";
import { NdArray } from "ndarray";
import * as util from "util";
import x256 from "x256";
import * as fs from "fs";

const getPixelsAsync = util.promisify(getPixels);

const charPixel = "  ";

function bg256(r: number, g: number, b: number): string {
  return escaped(48, 5, x256(r, g, b));
}

const bgClear = escaped(0);

function escaped(...str: (string | number)[]): string {
  const txt = str.join(";");
  return `\x1b[${txt}m`;
}

function bg(r: number, g: number, b: number, a: number): string {
  return a === 255 ? bg256(r, g, b) : bgClear;
}

interface ImgCatOptions {
  padding: boolean;
  // TODO: Support true color if you ask for it
  trueColor: boolean;
}

function fromPixels(pixels: NdArray<Uint8Array>, opts: ImgCatOptions): string {
  // Grab the first frame of an animated GIF.
  if (pixels.shape.length === 4) {
    pixels = pixels.pick(0, null, null, null);
  }
  const [width, height] = pixels.shape;
  let ret = "";
  if (opts.padding) {
    ret += "\n";
  }
  for (let j = 0; j < height; j++) {
    ret += bgClear;
    if (opts.padding) {
      ret += charPixel;
    }
    for (let i = 0; i < width; i++) {
      const r = pixels.get(i, j, 0);
      const g = pixels.get(i, j, 1);
      const b = pixels.get(i, j, 2);
      const a = pixels.get(i, j, 3);
      ret += bg(r, g, b, a);
      ret += charPixel;
    }
    ret += bgClear;
    ret += "\n";
  }
  return ret;
}

export async function fromFile(
  file: string,
  opts: ImgCatOptions
): Promise<string> {
  if (!fs.existsSync(file)) {
    throw new Error(`no such file "${file}"`);
  }
  const pixels = await getPixelsAsync(file, "");
  return fromPixels(pixels, opts);
}
