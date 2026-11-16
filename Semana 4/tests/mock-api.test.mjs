import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createHandler } from '../server/handler.mjs';
import { categories, books } from '../server/data.mjs';

async function withServer(run) {
  const server = createServer(createHandler({ delayMs: 0 }));
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try { return await run(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise((resolve, reject) => server.close((err) => err ? reject(err) : resolve())); }
}

test('GET /api/categories responde JSON e incluye cantidad de libros por categoría', () => withServer(async (base) => {
  const response = await fetch(`${base}/api/categories`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /application\/json/);
  const data = await response.json();
  assert.equal(data.total, 6);
  assert.deepEqual(data.categories.map((category) => category.id), categories.map((c) => c.id));
  assert.equal(data.categories.reduce((sum, c) => sum + c.count, 0), books.length);
}));

test('GET /api/books entrega catálogo y permite filtrar por categoría y buscar texto', () => withServer(async (base) => {
  const full = await (await fetch(`${base}/api/books`)).json();
  assert.equal(full.total, 18);
  const filtered = await (await fetch(`${base}/api/books?category=terror&q=Dr%C3%A1cula`)).json();
  assert.deepEqual(filtered.books.map(({ id }) => id), ['dracula']);
  assert.equal(filtered.total, 1);
}));

test('GET /api/books/:id responde detalles, o 404 en un libro inexistente', () => withServer(async (base) => {
  const good = await fetch(`${base}/api/books/dracula`);
  assert.equal(good.status, 200);
  assert.equal((await good.json()).book.title, 'Drácula');
  const missing = await fetch(`${base}/api/books/inexistente`);
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).code, 'BOOK_NOT_FOUND');
}));

test('Rutas y categorías inválidas responden 404 con JSON', () => withServer(async (base) => {
  for (const path of ['/api/otra-ruta', '/api/books?category=desconocida']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 404);
    assert.ok((await response.json()).error);
  }
}));

test('Los fallos simulados son controlados (404 y 500)', () => withServer(async (base) => {
  for (const status of [404, 500]) {
    const response = await fetch(`${base}/api/books?simulate=${status}`);
    assert.equal(response.status, status);
    assert.ok((await response.json()).error);
  }
}));

test('Se rechazan métodos de escritura en las rutas GET del catálogo', () => withServer(async (base) => {
  const response = await fetch(`${base}/api/books`, { method: 'POST' });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET');
}));

test('POST /api/orders confirma un pedido simulado y calcula el total desde el servidor', () => withServer(async (base) => {
  const response = await fetch(`${base}/api/orders`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer: { name: 'Cliente demo', email: 'demo@ejemplo.cl' }, items: [{ id: 'dracula', quantity: 2 }, { id: 'alicia', quantity: 1 }] }),
  });
  assert.equal(response.status, 201);
  const receipt = await response.json();
  assert.equal(receipt.mode, 'DEMO');
  assert.match(receipt.orderId, /^UMB-[A-F0-9]{8}$/);
  assert.equal(receipt.total, 2 * 14990 + 13990);
  assert.equal(receipt.items.length, 2);
  assert.equal(receipt.items[0].author, 'Bram Stoker');
  assert.equal(receipt.items[0].categoryId, 'terror');
  assert.equal(receipt.customer, undefined, 'No devuelve ni almacena datos personales');
}));

test('POST /api/orders rechaza cantidades inválidas, duplicados y libros desconocidos', () => withServer(async (base) => {
  const customer = { name: 'Cliente demo', email: 'demo@ejemplo.cl' };
  for (const items of [[{ id: 'dracula', quantity: 0 }], [{ id: 'dracula', quantity: 21 }], [{ id: 'desconocido', quantity: 1 }], [{ id: 'dracula', quantity: 1 }, { id: 'dracula', quantity: 2 }]]) {
    const response = await fetch(`${base}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customer, items }) });
    assert.equal(response.status, 400);
    assert.ok((await response.json()).code);
  }
}));

test('POST /api/orders valida campos, JSON y Content-Type', () => withServer(async (base) => {
  const options = { method: 'POST', headers: { 'Content-Type': 'application/json' } };
  let response = await fetch(`${base}/api/orders`, { ...options, body: JSON.stringify({ customer: { name: '', email: 'invalido' }, items: [{ id: 'dracula', quantity: 1 }] }) });
  assert.equal(response.status, 400);
  response = await fetch(`${base}/api/orders`, { ...options, body: '{no es json' });
  assert.equal(response.status, 400);
  response = await fetch(`${base}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: 'texto' });
  assert.equal(response.status, 415);
}));

test('GET /api/orders devuelve 405 y permite POST', () => withServer(async (base) => {
  const response = await fetch(`${base}/api/orders`);
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'POST');
}));
