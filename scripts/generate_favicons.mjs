import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceImagePath = 'C:/Users/janeg/.gemini/antigravity-ide/brain/56df3cd7-6e89-4ff9-b90a-866614b24f45/.user_uploaded/media_1791819530385.jpg';
const publicDir = path.resolve('public');

function createIco(images) {
  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + dirEntrySize * count;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4); // count

  const dirEntries = [];
  for (const img of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);
    offset += img.buffer.length;
  }
  return Buffer.concat([header, ...dirEntries, ...images.map((img) => img.buffer)]);
}

async function run() {
  console.log('Reading source image from:', sourceImagePath);

  // Center of artwork in 393x393 image is around (196.5, 171.5).
  // Crop a 304x304 centered square:
  // left: 45, top: 18, width: 304, height: 304
  const squareBase = await sharp(sourceImagePath)
    .extract({ left: 45, top: 18, width: 304, height: 304 })
    .png()
    .toBuffer();

  // Create rounded squircle mask (20% corner radius, standard for high-end web & mobile app icons)
  const squircleMask = Buffer.from(
    '<svg width="304" height="304"><rect x="0" y="0" width="304" height="304" rx="46" ry="46" fill="#ffffff"/></svg>'
  );
  const roundedMaster = await sharp(squareBase)
    .composite([{ input: squircleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Generate PNG sizes
  const sizes = [16, 32, 48, 64, 128, 192, 512];
  for (const size of sizes) {
    const out = path.join(publicDir, `logo-${size}.png`);
    await sharp(roundedMaster).resize(size, size).png().toFile(out);
    console.log(`Generated ${out}`);
  }

  // Generate favicon-16x16.png and favicon-32x32.png
  await sharp(roundedMaster)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));
  console.log('Generated favicon-16x16.png');

  await sharp(roundedMaster)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('Generated favicon-32x32.png');

  // Generate apple-touch-icon.png (180x180)
  await sharp(roundedMaster)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // Generate master logo.png (512x512)
  await sharp(roundedMaster)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'logo.png'));
  console.log('Generated logo.png');

  // Generate multi-resolution favicon.ico (16, 32, 48)
  const b16 = await sharp(roundedMaster).resize(16, 16).png().toBuffer();
  const b32 = await sharp(roundedMaster).resize(32, 32).png().toBuffer();
  const b48 = await sharp(roundedMaster).resize(48, 48).png().toBuffer();

  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: b16 },
    { width: 32, height: 32, buffer: b32 },
    { width: 48, height: 48, buffer: b48 },
  ]);

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Generated multi-res favicon.ico successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
