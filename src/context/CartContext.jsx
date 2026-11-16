import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CART_KEY, normalizeCart, totalUnits, updateCart } from '../lib/cart.js';
import { LAST_VOUCHER_KEY, normalizeVoucher } from '../lib/voucher.js';

const CartContext = createContext(null);
function initialCart() {
  try { return normalizeCart(JSON.parse(window.localStorage.getItem(CART_KEY) || '[]')); }
  catch { return []; }
}
function initialVoucher() {
  try { return normalizeVoucher(JSON.parse(window.localStorage.getItem(LAST_VOUCHER_KEY) || 'null')); }
  catch { return null; }
}
export function CartProvider({ children }) {
  const [items, setItems] = useState(initialCart);
  const [lastVoucher, setLastVoucher] = useState(initialVoucher);
  const [announcement, setAnnouncement] = useState('');
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  useEffect(() => {
    try {
      if (items.length) window.localStorage.setItem(CART_KEY, JSON.stringify(items));
      else window.localStorage.removeItem(CART_KEY);
    } catch { /* Almacenamiento puede estar deshabilitado. */ }
  }, [items]);
  useEffect(() => {
    try {
      if (lastVoucher) window.localStorage.setItem(LAST_VOUCHER_KEY, JSON.stringify(lastVoucher));
      else window.localStorage.removeItem(LAST_VOUCHER_KEY);
    } catch { /* Almacenamiento puede estar deshabilitado. */ }
  }, [lastVoucher]);
  // Un único bloqueo de scroll evita conflictos entre el cajón y el comprobante.
  useEffect(() => {
    if (!cartDrawerOpen && !voucherOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [cartDrawerOpen, voucherOpen]);

  const value = useMemo(() => ({
    items,
    count: totalUnits(items),
    lastVoucher,
    voucherOpen,
    cartDrawerOpen,
    openDrawer() { setVoucherOpen(false); setCartDrawerOpen(true); },
    closeDrawer() { setCartDrawerOpen(false); },
    openVoucher() { if (lastVoucher) { setCartDrawerOpen(false); setVoucherOpen(true); } },
    closeVoucher() { setVoucherOpen(false); },
    saveVoucher(order) {
      const voucher = normalizeVoucher(order);
      if (!voucher) throw new Error('El servidor devolvió un comprobante incompleto o inválido.');
      setLastVoucher(voucher);
      setCartDrawerOpen(false);
      setVoucherOpen(true);
      return voucher;
    },
    add(book) {
      setItems((previous) => updateCart(previous, book.id, 1));
      setAnnouncement(`${book.title} agregado al carrito.`);
    },
    increase(id) { setItems((previous) => updateCart(previous, id, 1)); },
    decrease(id) { setItems((previous) => updateCart(previous, id, -1)); },
    remove(id) { setItems((previous) => previous.filter((item) => item.id !== id)); },
    clear() { setItems([]); setAnnouncement('El carrito quedó vacío.'); },
  }), [items, lastVoucher, voucherOpen, cartDrawerOpen]);
  return <CartContext.Provider value={value}>
    {children}
    <span className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">{announcement}</span>
  </CartContext.Provider>;
}
export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('El carrito debe utilizarse dentro de CartProvider.');
  return value;
}
