import { rgb, linear } from '../src/color.js';
// Machado, Oliveira and Fernandes (2009), severity 1.0, linear RGB.
export const matrices = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritan: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
};
export function simulatedLab(hex: string, matrix: number[][]): number[] {
  const r = rgb(hex)!.map(linear);
  const [x, y, z] = matrix.map((row) =>
    Math.max(
      0,
      Math.min(
        1,
        row.reduce((s, v, i) => s + v * r[i], 0),
      ),
    ),
  );
  const l = Math.cbrt(0.4122214708 * x + 0.5363325363 * y + 0.0514459929 * z),
    m = Math.cbrt(0.2119034982 * x + 0.6806995451 * y + 0.1073969566 * z),
    s = Math.cbrt(0.0883024619 * x + 0.2817188376 * y + 0.6299787005 * z);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
export function distance(a: number[], b: number[]): number {
  return Math.hypot(...a.map((v, i) => v - b[i]));
}
