import test from 'node:test';
import assert from 'node:assert/strict';
import { ApiError, clearApiCache, getResource, requestJSON } from '../src/lib/api.js';

const ok = (body) => ({ ok: true, status: 200, headers: { get: () => 'application/json; charset=utf-8' }, json: async () => body });
const notOk = (status) => ({ ok: false, status, headers: { get: () => 'application/json' } });

test('requestJSON recibe y analiza JSON correctamente', async () => {
  assert.deepEqual(await requestJSON('/api/books', { fetchImpl: async () => ok({ books: [1] }) }), { books: [1] });
});

test('requestJSON convierte 404, 500 y desconexiones en errores comprensibles', async () => {
  for (const status of [404, 500]) {
    await assert.rejects(requestJSON('/api/fail', { fetchImpl: async () => notOk(status) }), (error) => error instanceof ApiError && error.status === status && Boolean(error.message));
  }
  await assert.rejects(requestJSON('/api/fail', { fetchImpl: async () => { throw new TypeError('NetworkError'); } }), (error) => error instanceof ApiError && error.code === 'NETWORK_ERROR');
});

test('La caché comparte peticiones concurrentes y evita consultas repetidas', async () => {
  clearApiCache();
  let calls = 0;
  const fakeFetch = async () => { calls++; await new Promise((resolve) => setTimeout(resolve, 5)); return ok({ total: 18 }); };
  const first = getResource('/api/books', { fetchImpl: fakeFetch });
  const second = getResource('/api/books', { fetchImpl: fakeFetch });
  assert.equal(first, second, 'Ambas vistas deben compartir una petición pendiente');
  await Promise.all([first, second]);
  await getResource('/api/books', { fetchImpl: fakeFetch });
  assert.equal(calls, 1, 'La respuesta se reutiliza dentro de su TTL');
  await getResource('/api/books', { fetchImpl: fakeFetch, force: true });
  assert.equal(calls, 2, 'Una recarga manual evita la caché');
  clearApiCache();
});

test('Una respuesta fallida no queda atrapada en caché y puede reintentarse', async () => {
  clearApiCache();
  let calls = 0;
  const fakeFetch = async () => { calls++; return calls === 1 ? notOk(500) : ok({ recovered: true }); };
  await assert.rejects(getResource('/api/retry', { fetchImpl: fakeFetch }));
  const result = await getResource('/api/retry', { fetchImpl: fakeFetch });
  assert.deepEqual(result, { recovered: true });
  assert.equal(calls, 2);
  clearApiCache();
});
