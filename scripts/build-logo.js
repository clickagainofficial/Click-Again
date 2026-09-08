/**
 * Turns the logo master into the web asset.
 *
 *   node scripts/build-logo.js
 *
 * public/Logo/ClickAgain.png  ->  public/clickagain-logo.png
 *
 * Three things happen:
 *   1. the empty margin around the mark is cropped off
 *   2. the image is box-downsampled to a sane web size
 *   3. the white plate behind the artwork is turned into real transparency,
 *      keeping the anti-aliased edges soft instead of jagged
 *
 * Pure Node + zlib, no image library needed.
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const SRC = process.argv[2] || "public/Logo/ClickAgain.png";
const OUT = process.argv[3] || "public/clickagain-logo.png";
const SCALE = Number(process.argv[4] || 4); // integer box downsample factor
const INK = 244; // below this luminance a pixel counts as artwork, for the crop

// ---------------------------------------------------------------- crc32 ----
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

// ------------------------------------------------------------ decode png ----
function decode(file) {
  let p = 8;
  let ihdr = null;
  const idat = [];

  while (p < file.length) {
    const len = file.readUInt32BE(p);
    const type = file.toString("ascii", p + 4, p + 8);
    if (type === "IHDR") ihdr = file.subarray(p + 8, p + 8 + len);
    if (type === "IDAT") idat.push(file.subarray(p + 8, p + 8 + len));
    if (type === "IEND") break;
    p += 12 + len;
  }

  const width = ihdr.readUInt32BE(0);
  const height = ihdr.readUInt32BE(4);
  const bitDepth = ihdr[8];
  const colorType = ihdr[9];
  const interlace = ihdr[12];

  if (bitDepth !== 8 || interlace !== 0 || (colorType !== 6 && colorType !== 2)) {
    throw new Error(
      `unsupported PNG (depth ${bitDepth}, colorType ${colorType}, interlace ${interlace})`
    );
  }

  const channels = colorType === 6 ? 4 : 3;
  const stride = width * channels;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const px = Buffer.alloc(height * stride);

  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const src = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    const cur = px.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? px.subarray((y - 1) * stride, y * stride) : null;

    for (let i = 0; i < stride; i++) {
      const a = i >= channels ? cur[i - channels] : 0;
      const b = prev ? prev[i] : 0;
      const c = prev && i >= channels ? prev[i - channels] : 0;
      let v = src[i];

      switch (filter) {
        case 0: break;
        case 1: v += a; break;
        case 2: v += b; break;
        case 3: v += (a + b) >> 1; break;
        case 4: {
          const pa = Math.abs(b - c);
          const pb = Math.abs(a - c);
          const pc = Math.abs(a + b - 2 * c);
          v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
          break;
        }
        default: throw new Error("bad filter byte " + filter);
      }

      cur[i] = v & 0xff;
    }
  }

  return { px, width, height, channels, stride };
}

// ------------------------------------------------------------ encode png ----
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encode(rows, width, height) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(rows, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ------------------------------------------------------------------ run ----
const { px, width, height, channels, stride } = decode(fs.readFileSync(SRC));
console.log(`source: ${width}x${height}, ${channels} channels`);

// 1. bounding box of the actual artwork
let minX = width;
let minY = height;
let maxX = -1;
let maxY = -1;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const o = y * stride + x * channels;
    if (channels === 4 && px[o + 3] < 16) continue;
    const lum = 0.299 * px[o] + 0.587 * px[o + 1] + 0.114 * px[o + 2];
    if (lum < INK) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

const pad = Math.round((maxY - minY) * 0.06);
minX = Math.max(0, minX - pad);
minY = Math.max(0, minY - pad);
maxX = Math.min(width - 1, maxX + pad);
maxY = Math.min(height - 1, maxY + pad);

const cw = maxX - minX + 1;
const ch = maxY - minY + 1;
const ow = Math.floor(cw / SCALE);
const oh = Math.floor(ch / SCALE);
console.log(`cropped: ${cw}x${ch} -> ${ow}x${oh} (scale 1/${SCALE})`);

// 2 + 3. downsample, then lift the white plate out into the alpha channel.
//
// Each source pixel is ink C composited over white:  P = A*C + (1-A)*255
// The darkest channel gives the coverage:            A = 1 - min(P)/255
// which un-premultiplies back to:                    C = (P - (1-A)*255) / A
//
// Pure white -> A 0, pure black -> A 1 and C 0, and a half-covered edge pixel
// recovers its true ink colour at half alpha. That keeps the curves smooth on
// any light background instead of leaving a white fringe.
const rows = Buffer.alloc(oh * (ow * 4 + 1));

for (let y = 0; y < oh; y++) {
  rows[y * (ow * 4 + 1)] = 0; // filter: none

  for (let x = 0; x < ow; x++) {
    let r = 0;
    let g = 0;
    let b = 0;
    let srcAlpha = 0;

    for (let dy = 0; dy < SCALE; dy++) {
      for (let dx = 0; dx < SCALE; dx++) {
        const o = (minY + y * SCALE + dy) * stride + (minX + x * SCALE + dx) * channels;
        const sa = channels === 4 ? px[o + 3] / 255 : 1;
        // flatten any existing transparency onto white first
        r += px[o] * sa + 255 * (1 - sa);
        g += px[o + 1] * sa + 255 * (1 - sa);
        b += px[o + 2] * sa + 255 * (1 - sa);
        srcAlpha += sa;
      }
    }

    const n = SCALE * SCALE;
    r /= n;
    g /= n;
    b /= n;
    srcAlpha /= n;

    const alpha = 1 - Math.min(r, g, b) / 255;
    const d = y * (ow * 4 + 1) + 1 + x * 4;

    if (alpha <= 0.002 || srcAlpha === 0) {
      rows[d] = rows[d + 1] = rows[d + 2] = rows[d + 3] = 0;
      continue;
    }

    const unmix = (v) => {
      const c = (v - (1 - alpha) * 255) / alpha;
      return Math.max(0, Math.min(255, Math.round(c)));
    };

    rows[d] = unmix(r);
    rows[d + 1] = unmix(g);
    rows[d + 2] = unmix(b);
    rows[d + 3] = Math.round(alpha * 255);
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, encode(rows, ow, oh));
console.log(`wrote ${OUT} — ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB, transparent background`);
