/**
 * generate-favicon.mjs
 * Generates a proper favicon.ico from public/logo.png using sharp.
 * Run: node generate-favicon.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, "public", "logo.png");
const outDir = path.join(__dirname, "public");

async function run() {
  // 1. Generate PNG favicon at multiple sizes for use as <link rel="icon">
  const sizes = [16, 32, 48, 64, 128, 192, 512];
  for (const size of sizes) {
    const out = path.join(outDir, `logo-${size}.png`);
    await sharp(src)
      .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(out);
    console.log(`✅ Generated ${out}`);
  }

  // 2. Generate favicon-32x32.png and favicon-16x16.png (standard names)
  await sharp(src).resize(32, 32, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile(path.join(outDir, "favicon-32x32.png"));
  await sharp(src).resize(16, 16, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile(path.join(outDir, "favicon-16x16.png"));

  // 3. Generate apple-touch-icon (180x180)
  await sharp(src).resize(180, 180, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile(path.join(outDir, "apple-touch-icon.png"));
  console.log("✅ Generated apple-touch-icon.png");

  // 4. Generate a high-quality 512x512 logo (for PWA manifest etc.)
  await sharp(src).resize(512, 512, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile(path.join(outDir, "logo-512.png"));
  console.log("✅ Generated logo-512.png");

  // 5. Overwrite favicon.ico with the 32x32 PNG data (browsers accept PNG-in-ICO)
  // We use the raw 32x32 PNG as favicon.ico — modern browsers handle this fine
  const favData = await sharp(src)
    .resize(32, 32, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(outDir, "favicon.ico"), favData);
  console.log("✅ Overwrote favicon.ico with Physiomatics logo");

  console.log("\n🎉 All favicon assets generated successfully!");
}

run().catch(console.error);
