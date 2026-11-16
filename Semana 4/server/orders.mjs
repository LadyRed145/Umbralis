import { randomUUID } from 'node:crypto';
import { books } from './data.mjs';

const MAX_BYTES = 16_384;
export async function readJson(req) {
  let body = '';
  for await (const chunk of req) {
    body += chunk.toString('utf8');
    if (Buffer.byteLength(body, 'utf8') > MAX_BYTES) {
      const error = new Error('El pedido supera el tamaño permitido.');
      error.code = 'PAYLOAD_TOO_LARGE';
      throw error;
    }
  }
  try { return JSON.parse(body); }
  catch {
    const error = new Error('Debes enviar un JSON válido.');
    error.code = 'INVALID_JSON';
    throw error;
  }
}

/** Pedidos exclusivamente ficticios, sin cobros ni persistencia de datos personales. */
export function createDemoOrder(payload) {
  const name = payload?.customer?.name?.trim();
  const email = payload?.customer?.email?.trim();
  if (typeof name !== 'string' || name.length < 2 || name.length > 90 ||
      typeof email !== 'string' || email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 400, body: { error: 'Ingresa un nombre y correo válidos para simular el pedido.', code: 'INVALID_CUSTOMER' } };
  }
  if (!Array.isArray(payload?.items) || payload.items.length < 1 || payload.items.length > 40) {
    return { status: 400, body: { error: 'El carrito debe contener entre 1 y 40 títulos.', code: 'INVALID_CART' } };
  }
  const seen = new Set();
  const lines = [];
  for (const item of payload.items) {
    if (typeof item?.id !== 'string' || seen.has(item.id) ||
        !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
      return { status: 400, body: { error: 'El carrito contiene cantidades o títulos repetidos inválidos.', code: 'INVALID_CART' } };
    }
    seen.add(item.id);
    const book = books.find((entry) => entry.id === item.id);
    if (!book) return { status: 400, body: { error: 'Uno de los títulos ya no se encuentra disponible.', code: 'UNKNOWN_BOOK' } };
    lines.push({ id: book.id, title: book.title, author: book.author, categoryId: book.categoryId, quantity: item.quantity, unitPrice: book.price, lineTotal: book.price * item.quantity });
  }
  const total = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  return { status: 201, body: {
    mode: 'DEMO', orderId: `UMB-${randomUUID().slice(0, 8).toUpperCase()}`,
    createdAt: new Date().toISOString(), items: lines, total,
    message: 'Pedido de demostración confirmado. No se efectuó ningún cobro ni envío de correo.',
  } };
}
