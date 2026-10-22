const named: Record<string, string> = {
  black: '#000000',
  white: '#FFFFFF',
  red: '#FF0000',
  green: '#008000',
  blue: '#0000FF',
  gray: '#808080',
  grey: '#808080',
  yellow: '#FFFF00',
  orange: '#FFA500',
  purple: '#800080',
  cyan: '#00FFFF',
  magenta: '#FF00FF',
};
export function rgb(color: string): number[] | undefined {
  const normalized = color.trim().toLowerCase();
  const h = (named[normalized] ?? normalized).replace(/^#/, '');
  if (/^[\da-f]{3}$/i.test(h)) return [...h].map((c) => parseInt(c + c, 16) / 255);
  if (/^[\da-f]{6}$/i.test(h)) return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const m = normalized.match(/^rgba?\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)/i);
  return m ? m.slice(1, 4).map((v) => Number(v) / 255) : undefined;
}
export const linear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
export function contrast(a: string, b: string): number {
  const lum = (c: string) => {
    const r = rgb(c);
    return r ? r.map(linear).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0) : NaN;
  };
  const x = lum(a),
    y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function hueBucket(c: string): number | undefined {
  const r = rgb(c);
  if (!r) return;
  const max = Math.max(...r),
    min = Math.min(...r),
    d = max - min;
  if (max === 0 || d / max < 0.45) return;
  const h =
    max === r[0] ? (r[1] - r[2]) / d : max === r[1] ? 2 + (r[2] - r[0]) / d : 4 + (r[0] - r[1]) / d;
  return Math.floor(((h * 60 + 360) % 360) / 60);
}
