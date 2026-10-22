import { global } from './global.js';
import { cn } from './cn.js';
export type PackName = 'global' | 'cn';
export type Mode = 'light' | 'dark';
export type DeltaColors = 'red-up' | 'green-up';
export interface Tokens {
    [key: string]: string | readonly string[];
    ink: string;
    muted: string;
    hairline: string;
    brand: string;
    other: string;
    up: string;
    down: string;
    categorical: readonly string[];
}
export interface Pack {
    name: PackName;
    deltaColors: DeltaColors;
    light: Tokens;
    dark: Tokens;
    typography: {
        body: number;
        minimum: number;
    };
    spacing: readonly number[];
}
export const packs: Record<PackName, Pack> = { global, cn };
export { global, cn };
export function getTokens(pack: PackName, mode: Mode = 'light'): Tokens { return packs[pack][mode]; }
