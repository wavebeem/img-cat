import getPixels from "get-pixels";
import { NdArray } from "ndarray";
import * as util from "util";
import x256 from "x256";

const getPixelsAsync = util.promisify(getPixels);

const charPixel = "  ";

function bg256(r: number, g: number, b: number): string {
  return escaped(48, 5, x256(r, g, b));
}

function bgTrueColor(r: number, g: number, b: number): string {
  return escaped(48, 2, r, g, b);
}

const bgClear = escaped(0);

function escaped(...str: (string | number)[]): string {
  const txt = str.join(";");
  return `\x1b[${txt}m`;
}

function bg(
  trueColor: boolean,
  r: number,
  g: number,
  b: number,
  a: number
): string {
  if (a < 255) {
    return bgClear;
  }
  if (trueColor) {
    return bgTrueColor(r, g, b);
  }
  return bg256(r, g, b);
}

interface ImgCatOptions {
  padding: boolean;
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
      ret += bg(opts.trueColor, r, g, b, a);
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
  const pixels = await getPixelsAsync(file, "");
  return fromPixels(pixels, opts);
}
