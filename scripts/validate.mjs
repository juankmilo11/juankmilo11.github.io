// One entry point for deterministic checks; browser QA and FCT builds are explicit.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const checks = [
  ['.', ['scripts/check-site.mjs']],
  ['.', ['scripts/check-paca.mjs']],
  ['.', ['scripts/build-paca.mjs']],
  ['.', ['--test', 'scripts/tests/*.test.cjs']],
  ...['booking', 'schedule', 'i18n', 'theme'].map(name => ['.', [`scripts/test-paca-${name}.cjs`]]),
  ['projects/services-api/', ['--test', 'tests/*.test.mjs']],
  ['projects/services-api/', ['build.mjs']],
  ['projects/FCT/', ['--test']]
];
for (const [directory, args] of checks) {
  const result = spawnSync(process.execPath, args, { cwd: fileURLToPath(new URL(directory, root)), stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log('OK: site, PACA, JK/API, Worker build and FCT checks passed.');
