import type { PageFacts, Option } from '../../src/types.js';
export const chart = (option: Option): PageFacts => ({ charts: [{ option }] });
export const text = (overrides = {}) => ({
  selector: '#text',
  text: 'Label',
  color: '#111111',
  background: '#ffffff',
  fontSize: 14,
  fontWeight: 400,
  ...overrides,
});
