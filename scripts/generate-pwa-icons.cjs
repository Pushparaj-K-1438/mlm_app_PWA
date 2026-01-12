const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceLogo = path.join(__dirname, '../src/assets/logo.png');
const publicDir = path.join(__dirname, '../public');

// Ensure the public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate icons with different sizes
async function generateIcons() {
  for (const size of sizes) {
    const targetPath = path.join(publicDir, `logo-${size}x${size}.png`);

    try {
      await sharp(sourceLogo)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(targetPath);

      console.log(`Created: logo-${size}x${size}.png`);
    } catch (error) {
      console.error(`Error creating ${size}x${size} icon:`, error.message);
    }
  }

  // Also copy the main logo
  const logoPath = path.join(publicDir, 'logo.png');
  await sharp(sourceLogo)
    .png()
    .toFile(logoPath);
  console.log('Created: logo.png');

  console.log('\nPWA icons generated successfully!');
}

generateIcons().catch(console.error);
