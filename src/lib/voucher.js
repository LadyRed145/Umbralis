/** Último comprobante: copia local exclusivamente del pedido DEMO, sin datos personales. */
export const LAST_VOUCHER_KEY = 'umbralis-last-voucher-v1';

export function normalizeVoucher(raw) {
  if (!raw || typeof raw !== 'object' || raw.mode !== 'DEMO' ||
      typeof raw.orderId !== 'string' || !/^UMB-[A-F\d]{8}$/.test(raw.orderId) ||
      typeof raw.createdAt !== 'string' || !Number.isFinite(Date.parse(raw.createdAt)) ||
      !Array.isArray(raw.items) || raw.items.length === 0 || raw.items.length > 40) return null;
  const seen = new Set();
  let total = 0;
  const items = [];
  for (const item of raw.items) {
    if (!item || typeof item.id !== 'string' || !/^[a-z\d-]{1,80}$/.test(item.id) || seen.has(item.id) ||
        typeof item.title !== 'string' || item.title.length < 1 || item.title.length > 200 ||
        !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20 ||
        !Number.isSafeInteger(item.unitPrice) || item.unitPrice < 0 ||
        !Number.isSafeInteger(item.lineTotal) || item.lineTotal !== item.unitPrice * item.quantity) return null;
    seen.add(item.id);
    total += item.lineTotal;
    if (!Number.isSafeInteger(total)) return null;
    items.push({ id: item.id, title: item.title, quantity: item.quantity,
      unitPrice: item.unitPrice, lineTotal: item.lineTotal,
      author: typeof item.author === 'string' ? item.author.slice(0, 160) : '',
      categoryId: typeof item.categoryId === 'string' ? item.categoryId.slice(0, 80) : '' });
  }
  if (total !== raw.total) return null;
  return { mode: 'DEMO', orderId: raw.orderId, createdAt: raw.createdAt, items, total };
}

export function voucherUnits(voucher) {
  return voucher?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}

export function voucherDate(iso) {
  return new Intl.DateTimeFormat('es-CL', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(iso));
}
