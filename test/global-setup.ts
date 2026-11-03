import { execFileSync } from 'node:child_process';

/** Compile once before workers start. Parallel tsc from test files truncates dist/cli.js. */
export default function setup(): void {
  execFileSync(process.execPath, ['node_modules/typescript/bin/tsc'], { stdio: 'inherit' });
}
