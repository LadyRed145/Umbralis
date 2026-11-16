/** Estado serializable del carrito: solo ID de libro y cantidad; precios provienen de REST. */
export const CART_KEY = 'umbralis-cart-v1';
export const MAX_UNITS_PER_BOOK = 20;
export const MAX_CART_ITEMS = 40;

export function normalizeCart(raw) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  return raw.slice(0, MAX_CART_ITEMS).flatMap((item) => {
    if (!item || typeof item.id !== 'string' || !/^[a-z0-9-]{1,80}$/.test(item.id) || seen.has(item.id)) return [];
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_UNITS_PER_BOOK) return [];
    seen.add(item.id);
    return [{ id: item.id, quantity }];
  });
}
export function updateCart(cart, id, delta) {
  if (!/^[a-z0-9-]{1,80}$/.test(id) || !Number.isInteger(delta)) return cart;
  const existing = cart.find((item) => item.id === id);
  const next = Math.max(0, Math.min(MAX_UNITS_PER_BOOK, (existing?.quantity ?? 0) + delta));
  if (existing) return next === 0 ? cart.filter((item) => item.id !== id) : cart.map((item) => item.id === id ? { ...item, quantity: next } : item);
  if (next > 0 && cart.length < MAX_CART_ITEMS) return [...cart, { id, quantity: next }];
  return cart;
}
export function totalUnits(cart) { return cart.reduce((sum, item) => sum + item.quantity, 0); }
export function cartSubtotal(cart, books) {
  const priceMap = new Map(books.map((book) => [book.id, book.price]));
  return cart.reduce((sum, item) => sum + (priceMap.get(item.id) ?? 0) * item.quantity, 0);
}
