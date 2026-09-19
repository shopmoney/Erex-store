import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

async function processImage(inputName, outputName) {
  const inputPath = path.resolve('src/assets/images', inputName);
  const outputPath = path.resolve('src/assets/images', outputName);

  console.log(`Processing ${inputPath}...`);
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  // Extract raw RGBA
  const rawBuffer = await image.ensureAlpha().raw().toBuffer();

  // Create a clean transparency mask based on color distance from black
  // Background in the JPG is near black (#000000 to #0b0b0f).
  // For each pixel:
  // Calculate max(r, g, b) or perceived luminance.
  // If brightness < 20, alpha = 0.
  // Between 20 and 55, smooth feather transition.
  // If > 55, alpha = 255.
  // Also flood-fill or edge-aware check if needed, or simply luminance threshold since subjects have bright colors (white robot, blue accents, light skin/clothing).
  for (let i = 0; i < rawBuffer.length; i += 4) {
    const r = rawBuffer[i];
    const g = rawBuffer[i + 1];
    const b = rawBuffer[i + 2];

    const brightness = Math.max(r, g, b);

    if (brightness < 16) {
      rawBuffer[i + 3] = 0; // Completely transparent
    } else if (brightness < 42) {
      // Smooth feather falloff
      const factor = (brightness - 16) / (42 - 16);
      rawBuffer[i + 3] = Math.round(255 * factor);
    } else {
      rawBuffer[i + 3] = 255;
    }
  }

  await sharp(rawBuffer, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

  console.log(`Saved transparent PNG to ${outputPath}`);
}

async function run() {
  await processImage('hero_robot_cutout_1789771388748.jpg', 'hero_robot_transparent.png');
  await processImage('hero_human_cutout_1789771400338.jpg', 'hero_human_transparent.png');
  console.log('Finished processing transparent images!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
