const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_IMAGES_DIR = path.resolve('client/public/images');
const BACKUP_DIR = path.resolve('client/public/images_original_backup');
const DIST_IMAGES_DIR = path.resolve('client/dist/images');

async function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (item.name === 'images_original_backup') continue;
      results = results.concat(await getAllFiles(fullPath));
    } else if (/\.(png|jpe?g|webp)$/i.test(item.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath);
  const relPath = path.relative(PUBLIC_IMAGES_DIR, filePath);

  // Read backup original if exists, otherwise read current file
  const backupPath = path.join(BACKUP_DIR, relPath);
  const sourcePath = fs.existsSync(backupPath) ? backupPath : filePath;
  const inputBuffer = fs.readFileSync(sourcePath);
  const originalSize = inputBuffer.length;

  let pipeline = sharp(inputBuffer);
  const meta = await sharp(inputBuffer).metadata();

  // Resize rules
  if (base.includes('crc-badge')) {
    pipeline = pipeline.resize({ width: 384, withoutEnlargement: true });
  } else if (base.startsWith('crc-logo-')) {
    pipeline = pipeline.resize({ width: 900, withoutEnlargement: true });
  } else if (base.startsWith('category-')) {
    pipeline = pipeline.resize({ width: 800, withoutEnlargement: true });
  } else if (meta.width && meta.width > 1280) {
    pipeline = pipeline.resize({ width: 1280, withoutEnlargement: true });
  }

  let compressedBuffer;
  if (ext === '.png') {
    compressedBuffer = await pipeline
      .png({
        compressionLevel: 9,
        palette: true,
        quality: base.startsWith('crc-') ? 90 : 80,
      })
      .toBuffer();
  } else if (ext === '.jpg' || ext === '.jpeg') {
    compressedBuffer = await pipeline
      .jpeg({
        quality: 80,
        mozjpeg: true,
        progressive: true,
      })
      .toBuffer();
  } else if (ext === '.webp') {
    compressedBuffer = await pipeline
      .webp({
        quality: 80,
        effort: 6,
      })
      .toBuffer();
  }

  // Only replace if compressedBuffer is smaller
  if (compressedBuffer && compressedBuffer.length < originalSize) {
    fs.writeFileSync(filePath, compressedBuffer);
  } else {
    fs.writeFileSync(filePath, inputBuffer);
    compressedBuffer = inputBuffer;
  }

  const finalSize = compressedBuffer.length;
  const reduction = (((originalSize - finalSize) / originalSize) * 100).toFixed(1);

  console.log(
    `${relPath.padEnd(45)} | ${(originalSize / 1024).toFixed(1).padStart(7)} KB -> ${(finalSize / 1024)
      .toFixed(1)
      .padStart(6)} KB (-${reduction}%)`
  );

  return { originalSize, finalSize };
}

async function main() {
  console.log('--- COMPRESSING ALL WEBSITE IMAGES ---');
  const files = await getAllFiles(PUBLIC_IMAGES_DIR);
  let totalOrig = 0;
  let totalComp = 0;

  for (const f of files) {
    const res = await processFile(f);
    totalOrig += res.originalSize;
    totalComp += res.finalSize;
  }

  console.log('--------------------------------------------------------------------------');
  console.log(`Original Total:   ${(totalOrig / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Compressed Total: ${(totalComp / (1024 * 1024)).toFixed(2)} MB`);
  console.log(
    `Saved:            ${((totalOrig - totalComp) / (1024 * 1024)).toFixed(2)} MB (-${(
      ((totalOrig - totalComp) / totalOrig) *
      100
    ).toFixed(1)}%)`
  );
  console.log('--------------------------------------------------------------------------');

  // Also sync to client/dist/images if dist exists
  if (fs.existsSync(DIST_IMAGES_DIR)) {
    console.log('Syncing compressed images to client/dist/images...');
    fs.cpSync(PUBLIC_IMAGES_DIR, DIST_IMAGES_DIR, { recursive: true });
    console.log('Dist sync complete!');
  }
}

main().catch(console.error);
