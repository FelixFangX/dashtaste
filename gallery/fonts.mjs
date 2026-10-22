import { mkdir, copyFile } from 'node:fs/promises';
export async function copyFonts() {
  await mkdir('gallery/vendor/fonts', { recursive: true });
  for (const name of ['inter', 'instrument-sans'])
    await copyFile(
      `node_modules/@fontsource-variable/${name}/files/${name}-latin-wght-normal.woff2`,
      `gallery/vendor/fonts/${name}.woff2`,
    );
}
