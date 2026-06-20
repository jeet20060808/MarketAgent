import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LANDING = path.join(__dirname, "../public/landing");

const ASSETS = path.join(__dirname, "../assets");

const sources = {
  "laptop.png": `${ASSETS}/WhatsApp_Image_2026-06-16_at_17.05.29-ca7824fb-831b-4226-b761-0919011519cc.png`,
  "network-cube.png": `${ASSETS}/WhatsApp_Image_2026-06-16_at_17.05.31-ffd95970-4b9a-4513-a0b4-6796f765c68f.png`,
  "chip.png": `${ASSETS}/WhatsApp_Image_2026-06-16_at_17.05.30-97cec563-cbe7-45a1-b51f-701b40dd75d1.png`,
  "eye.png": `${ASSETS}/WhatsApp_Image_2026-06-16_at_17.05.31__1_-7f9410ec-f0c2-4cb1-8e5d-b7775a37ac15.png`,
  "cable.png": `${ASSETS}/WhatsApp_Image_2026-06-16_at_17.05.30__1_-9181f767-e808-41bf-bc6b-31de402dab4e.png`,
};

function maxC(data, i) {
  return Math.max(data[i], data[i + 1], data[i + 2]);
}

function saturation(data, i) {
  return maxC(data, i) - Math.min(data[i], data[i + 1], data[i + 2]);
}

function edgeFloodRemove(data, width, height, channels, threshold) {
  const total = width * height;
  const isBg = new Uint8Array(total);
  const queue = [];

  const seed = (x, y) => {
    const idx = y * width + x;
    if (maxC(data, idx * channels) < threshold) queue.push(idx);
  };

  for (let x = 0; x < width; x++) {
    seed(x, 0);
    seed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    seed(0, y);
    seed(width - 1, y);
  }

  while (queue.length) {
    const idx = queue.pop();
    if (isBg[idx]) continue;
    isBg[idx] = 1;

    const x = idx % width;
    const y = (idx - x) / width;
    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ]) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const nIdx = ny * width + nx;
      if (!isBg[nIdx] && maxC(data, nIdx * channels) < threshold) queue.push(nIdx);
    }
  }

  for (let idx = 0; idx < total; idx++) {
    if (isBg[idx]) data[idx * channels + 3] = 0;
  }
}

function removeEnclosedBlackHoles(data, width, height, channels) {
  const total = width * height;
  const isDark = (idx) => {
    const i = idx * channels;
    return data[i + 3] > 20 && maxC(data, i) < 58 && saturation(data, i) < 35;
  };
  const isOrange = (idx) => {
    const i = idx * channels;
    return data[i] > 120 && data[i + 1] < 140 && data[i + 2] < 100 && data[i + 3] > 200;
  };
  const visited = new Uint8Array(total);

  for (let idx = 0; idx < total; idx++) {
    if (!isDark(idx) || visited[idx]) continue;
    const comp = [];
    const queue = [idx];
    visited[idx] = 1;
    let touchesOrange = false;
    let minX = width,
      minY = height,
      maxX = 0,
      maxY = 0;

    while (queue.length) {
      const cur = queue.pop();
      comp.push(cur);
      const x = cur % width;
      const y = (cur - x) / width;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      if (isOrange(cur)) touchesOrange = true;

      for (const [nx, ny] of [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ]) {
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const n = ny * width + nx;
        if (isOrange(n)) touchesOrange = true;
        if (!visited[n] && isDark(n)) {
          visited[n] = 1;
          queue.push(n);
        }
      }
    }

    const area = comp.length;
    const box = (maxX - minX + 1) * (maxY - minY + 1);
    const fill = area / box;
    if (area > 8000 && fill > 0.35 && !touchesOrange) {
      for (const c of comp) {
        const o = c * channels;
        data[o] = 0;
        data[o + 1] = 0;
        data[o + 2] = 0;
        data[o + 3] = 0;
      }
    }
  }
}

function cleanAlpha(data, width, height, channels) {
  for (let idx = 0; idx < width * height; idx++) {
    const i = idx * channels;
    if (data[i + 3] === 0) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
    }
  }
}

async function processImage(filename, mode, options = {}) {
  const input = sources[filename];
  const output = path.join(LANDING, filename);
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const buffer = Buffer.from(data);

  if (mode === "edge") {
    edgeFloodRemove(buffer, info.width, info.height, info.channels, options.threshold ?? 70);
    if (filename === "cable.png") {
      removeEnclosedBlackHoles(buffer, info.width, info.height, info.channels);
    }
  }

  cleanAlpha(buffer, info.width, info.height, info.channels);

  const trimmed = await sharp(buffer, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .trim({ threshold: 1 })
    .png()
    .toBuffer();

  await sharp(trimmed).toFile(output);
  const meta = await sharp(output).metadata();
  console.log(`${filename} [${mode}] -> ${meta.width}x${meta.height}`);
}

await processImage("laptop.png", "edge", { threshold: 52 });
await processImage("network-cube.png", "edge", { threshold: 72 });
await processImage("chip.png", "edge", { threshold: 72 });
await processImage("eye.png", "edge", { threshold: 72 });
await processImage("cable.png", "edge", { threshold: 52 });

console.log("Done");
