import { cp, mkdir, copyFile } from 'node:fs/promises';
import { copyFonts } from '../gallery/fonts.mjs';

// Run from the repository root after compiling the engine.
await copyFonts();
await mkdir('gallery/vendor', { recursive: true });
await copyFile('node_modules/echarts/dist/echarts.min.js', 'gallery/vendor/echarts.min.js');
await cp('gallery', 'site/public/gallery', { recursive: true });
await cp('dist', 'site/public/dist', { recursive: true });
