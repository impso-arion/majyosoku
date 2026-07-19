import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = 'src/content/blog/dlsite-kurokami-shirt-lift/images';
fs.mkdirSync(dir, { recursive: true });

const labels = ['01', '02', '03', '04'];

await Promise.all(
	labels.map(async (n) => {
		const name = `rj01612853_${n}.png`;
		const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="768" height="768">
  <rect width="100%" height="100%" fill="#2a2932"/>
  <text x="50%" y="44%" fill="#9490a0" font-size="36" font-family="sans-serif" text-anchor="middle">PLACEHOLDER</text>
  <text x="50%" y="52%" fill="#b48bff" font-size="28" font-family="sans-serif" text-anchor="middle">${name}</text>
  <text x="50%" y="60%" fill="#877f96" font-size="20" font-family="sans-serif" text-anchor="middle">生成画像で上書きしてね</text>
</svg>`;
		await sharp(Buffer.from(svg)).png().toFile(path.join(dir, name));
	}),
);

console.log('placeholders written to', dir);
