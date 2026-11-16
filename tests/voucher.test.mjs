import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeVoucher, voucherUnits, voucherDate } from '../src/lib/voucher.js';

const voucher = {
  mode: 'DEMO', orderId: 'UMB-1A2B3C4D', createdAt: '2026-11-16T07:00:00.000Z',
  items: [{ id: 'dracula', title: 'Drácula', author: 'Bram Stoker', categoryId: 'terror', quantity: 2, unitPrice: 14990, lineTotal: 29980 }],
  total: 29980,
};

test('Comprobante conserva folio, libros, fecha y totales verificables', () => {
  const result = normalizeVoucher(voucher);
  assert.equal(result.orderId, 'UMB-1A2B3C4D');
  assert.equal(result.items[0].author, 'Bram Stoker');
  assert.equal(result.total, 29980);
  assert.equal(voucherUnits(result), 2);
  assert.match(voucherDate(result.createdAt), /2026/);
});

test('Comprobante nunca persiste datos personales del formulario', () => {
  const result = normalizeVoucher({ ...voucher, customer: { name: 'Nombre privado', email: 'prueba@ejemplo.cl' }, card: '1234' });
  assert.equal(result.customer, undefined);
  assert.equal(result.card, undefined);
  assert.doesNotMatch(JSON.stringify(result), /Nombre privado|prueba@ejemplo.cl|1234/);
});

test('Comprobante rechaza folios falsos, precios manipulados y duplicados', () => {
  assert.equal(normalizeVoucher({ ...voucher, orderId: '../incorrecto' }), null);
  assert.equal(normalizeVoucher({ ...voucher, total: 1 }), null);
  assert.equal(normalizeVoucher({ ...voucher, items: [{ ...voucher.items[0], lineTotal: 1 }] }), null);
  assert.equal(normalizeVoucher({ ...voucher, items: [voucher.items[0], voucher.items[0]] }), null);
});

test('La fecha en el voucher permanece formateada en español', () => {
  assert.ok(voucherDate(voucher.createdAt).length > 12);
});
