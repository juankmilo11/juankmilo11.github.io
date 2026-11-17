import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { passwordHash, verifyPassword } from '../worker/index.js';
import { D1Database, R2Bucket } from './adapter.mjs';

// Synthetic credentials and isolated in-memory storage; no production access.
const password = 'Synthetic audit passphrase ' + crypto.randomUUID();
const encoded = await passwordHash(password);
function environment() {
  return {
    DB: new D1Database(), BUCKET: new R2Bucket(), ADMIN_PASSWORD_HASH: encoded,
    ALLOWED_ORIGINS: 'https://juankmilo11.github.io', RATE_LIMIT_SECRET: crypto.randomUUID()
  };
}
async function call(env, path, method = 'GET', data, token) {
  const headers = { Origin: 'https://juankmilo11.github.io' };
  if (token) headers.Authorization = 'Bearer ' + token;
  if (data !== undefined) headers['Content-Type'] = 'application/json';
  return worker.fetch(new Request('https://audit.example' + path, {
    method, headers, body: data === undefined ? undefined : JSON.stringify(data)
  }), env);
}

test('identical passwords receive independent random salts and verify only the original password', async () => {
  const another = await passwordHash(password);
  assert.notEqual(encoded, another);
  assert.notEqual(encoded.split('$')[2], another.split('$')[2]);
  assert.equal(Buffer.from(encoded.split('$')[2], 'base64').length, 16);
  assert.equal(Buffer.from(encoded.split('$')[3], 'base64').length, 32);
  assert.equal(await verifyPassword(password, encoded), true);
  assert.equal(await verifyPassword(password + '-wrong', encoded), false);
});

test('every administrative data or mutation route rejects missing and forged sessions', async () => {
  const env = environment();
  const id = '00000000-0000-4000-8000-000000000001';
  const operations = [
    ['/api/admin/appointments', 'GET'], ['/api/admin/appointments/' + id, 'GET'],
    ['/api/admin/appointments/' + id, 'PATCH', {}], ['/api/admin/appointments/' + id + '?version=1', 'DELETE'],
    ['/api/admin/attachments/' + id, 'GET'], ['/api/admin/export', 'GET'],
    ['/api/admin/schedule', 'GET'], ['/api/admin/schedule', 'PUT', {}], ['/api/admin/schedule/preview', 'POST', {}],
    ['/api/admin/templates', 'GET'], ['/api/admin/templates', 'PUT', {}],
    ['/api/admin/password', 'POST', {}], ['/api/admin/logout', 'POST', {}]
  ];
  try {
    for (const [path, method, data] of operations) {
      for (const token of [undefined, 'x'.repeat(43)]) {
        const response = await call(env, path, method, data, token);
        assert.equal(response.status, 401, method + ' ' + path);
        assert.equal(response.headers.get('Cache-Control'), 'no-store');
        const text = await response.text();
        assert.ok(!text.includes(password) && !text.includes(encoded));
      }
    }
  } finally { env.DB.close(); }
});

test('public status, availability and authenticated backup never return password or session material', async () => {
  const env = environment();
  try {
    const login = await call(env, '/api/admin/login', 'POST', { password });
    const session = await login.json();
    assert.equal(login.status, 200);
    assert.ok(session.token);
    for (const path of ['/api/health', '/api/availability', '/api/admin/export']) {
      const response = await call(env, path, 'GET', undefined, path.includes('/admin/') ? session.token : undefined);
      assert.equal(response.status, 200);
      const text = await response.text();
      for (const secret of [password, encoded, session.token, 'password_hash', 'token_hash']) assert.ok(!text.includes(secret), path);
    }
  } finally { env.DB.close(); }
});
