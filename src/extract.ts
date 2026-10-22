import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { PageFacts } from './types.js';
import { extractInPage } from './extract-in-page.js';
export { extractInPage } from './extract-in-page.js';

export async function extractPage(input: string): Promise<PageFacts> {
  let chromium;
  try {
    ({ chromium } = await import('playwright-core'));
  } catch {
    throw new Error(
      'HTML mode requires playwright-core and a browser; set CHROME_PATH to Chromium',
    );
  }
  const executablePath =
    process.env.CHROME_PATH ||
    (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath });
  } catch {
    throw new Error('browser unavailable; set CHROME_PATH to a Chromium executable');
  }
  try {
    const page = await browser.newPage();
    await page.goto(/^https?:\/\//i.test(input) ? input : pathToFileURL(resolve(input)).href, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    await page.waitForTimeout(500);
    return await page.evaluate(extractInPage);
  } finally {
    await browser.close();
  }
}
