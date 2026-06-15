#!/usr/bin/env node
// Record demo.html as a sequence of PNG frames for GIF assembly.
// Requires: npm i -D playwright gifencoder pngjs
// Usage:    node scripts/record-demo.mjs
// Output:   assets/demo.gif

import { chromium } from 'playwright';
import { createWriteStream, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import GIFEncoder from 'gifencoder';
import { PNG } from 'pngjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const demoPath = join(root, 'assets', 'demo.html');
const outputPath = join(root, 'assets', 'demo.gif');

const WIDTH = 960;
const HEIGHT = 600;
const FRAME_DELAY = 3000; // 3 seconds per frame

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
  await page.goto(`file://${demoPath}`);
  await page.waitForTimeout(1000);

  const encoder = new GIFEncoder(WIDTH, HEIGHT);
  const stream = createWriteStream(outputPath);
  encoder.createReadStream().pipe(stream);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(FRAME_DELAY);
  encoder.setQuality(10);

  // Frame 1: full view, hold for reading
  const buf = await page.screenshot({ type: 'png' });
  addFrame(encoder, buf, WIDTH, HEIGHT);

  // Frame 2: zoom into "WITHOUT" panel
  await page.evaluate(() => {
    document.querySelector('.panel.without').scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(300);
  const buf2 = await page.screenshot({ type: 'png' });
  addFrame(encoder, buf2, WIDTH, HEIGHT);

  // Frame 3: zoom into "WITH" panel
  await page.evaluate(() => {
    document.querySelector('.panel.with').scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(300);
  const buf3 = await page.screenshot({ type: 'png' });
  addFrame(encoder, buf3, WIDTH, HEIGHT);

  // Frame 4: back to full view
  addFrame(encoder, buf, WIDTH, HEIGHT);

  encoder.finish();
  await browser.close();

  await new Promise((resolve) => stream.on('finish', resolve));
  console.log(`GIF saved to ${outputPath}`);
}

function addFrame(encoder, pngBuffer, width, height) {
  const png = PNG.sync.read(pngBuffer);
  encoder.addFrame(png.data);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
