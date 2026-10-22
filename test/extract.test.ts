import {it,expect} from 'vitest';
import {existsSync} from 'node:fs';
import {extractPage} from '../src/extract.js';
let available=false;
try {const {chromium}=await import('playwright-core');const path=process.env.CHROME_PATH||(existsSync('/usr/bin/google-chrome')?'/usr/bin/google-chrome':chromium.executablePath());available=existsSync(path);}catch{}
it.skipIf(!available)('extracts local fixture',async()=>{const f=await extractPage('test/fixtures/dashboard.html');expect(f.charts).toHaveLength(1);expect(f.charts[0].option.series[0].smooth).toBe(true);expect(f.texts?.some(t=>t.text==='销量'&&t.fontSize===11)).toBe(true);expect(f.kpis).toHaveLength(1);expect(f.deltas?.[0].text).toBe('▲ 7.2%');expect(f.gradients).toHaveLength(1);expect(f.shadows).toHaveLength(1);},40000);
