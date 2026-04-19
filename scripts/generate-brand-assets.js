const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BRAND = path.join(ROOT, 'public', 'brand');
const ICONS = path.join(ROOT, 'public', 'icons');
const PUBLIC = path.join(ROOT, 'public');

async function generatePNGs() {
  const logoDark = fs.readFileSync(path.join(BRAND, 'logo-dark.svg'));
  const logoLight = fs.readFileSync(path.join(BRAND, 'logo-light.svg'));

  // icon-192x192.png (from logo-dark)
  await sharp(logoDark)
    .resize(192, 192)
    .png()
    .toFile(path.join(ICONS, 'icon-192x192.png'));
  console.log('Created icon-192x192.png');

  // icon-512x512.png (from logo-dark)
  await sharp(logoDark)
    .resize(512, 512)
    .png()
    .toFile(path.join(ICONS, 'icon-512x512.png'));
  console.log('Created icon-512x512.png');

  // apple-touch-icon.png (180x180, from logo-dark)
  await sharp(logoDark)
    .resize(180, 180)
    .png()
    .toFile(path.join(PUBLIC, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // favicon.png (32x32, from logo-dark)
  await sharp(logoDark)
    .resize(32, 32)
    .png()
    .toFile(path.join(PUBLIC, 'favicon.png'));
  console.log('Created favicon.png');
}

async function generateOGImage() {
  const logoDark = fs.readFileSync(path.join(BRAND, 'logo-dark.svg'));

  // Resize logo to 280x280
  const logoResized = await sharp(logoDark)
    .resize(280, 280)
    .png()
    .toBuffer();

  // Create the text SVG overlay
  const textSvg = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;1,500');
        </style>
      </defs>
      <text x="600" y="440" text-anchor="middle" font-family="'Fraunces', Georgia, serif" font-size="52" font-weight="500" letter-spacing="-0.025em">
        <tspan fill="#F4EEDF">İyi</tspan><tspan fill="#E8C268" font-style="italic">Biri</tspan>
      </text>
      <text x="600" y="495" text-anchor="middle" font-family="'Fraunces', Georgia, serif" font-size="24" font-weight="400" fill="#A89E8A" letter-spacing="0.02em">
        İyilik biriktirilir.
      </text>
    </svg>
  `);

  // Create background
  const bg = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 36, g: 32, b: 27, alpha: 1 } // #24201B
    }
  })
    .png()
    .toBuffer();

  // Composite: background + logo centered + text
  await sharp(bg)
    .composite([
      {
        input: logoResized,
        top: 60,
        left: Math.round((1200 - 280) / 2),
      },
      {
        input: textSvg,
        top: 0,
        left: 0,
      }
    ])
    .png()
    .toFile(path.join(PUBLIC, 'og-image.png'));

  console.log('Created og-image.png');
}

async function main() {
  console.log('Generating brand PNG assets...\n');
  await generatePNGs();
  console.log('');
  await generateOGImage();
  console.log('\nDone!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
