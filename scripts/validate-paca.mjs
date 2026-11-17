// PACA deployment checks need only Node; FCT and the API deploy independently.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const checks = [
  ['scripts/check-paca.mjs'],
  ['--test', 'scripts/tests/api-client.test.cjs'],
  ...['booking', 'schedule', 'i18n', 'theme'].map(name => [`scripts/test-paca-${name}.cjs`]),
  ['scripts/build-paca.mjs']
];
for (const args of checks) {
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log('OK: PACA checks and standalone build passed; dist/paca is ready.');
