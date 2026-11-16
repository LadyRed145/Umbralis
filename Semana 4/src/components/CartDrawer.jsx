import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { formatPrice } from './BookCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useApiResource } from '../hooks/useApiResource.js';
import { cartSubtotal, MAX_UNITS_PER_BOOK } from '../lib/cart.js';

/** Panel lateral inspirado en el carrito NatGamez, sin depender de Bootstrap. */
export default function CartDrawer() {
  const { items, increase, decrease, remove, clear, count, closeDrawer,
    lastVoucher, openVoucher } = useCart();
  const { status, data, error, retry } = useApiResource(count > 0 ? '/api/books' : null);
  const drawerRef = useRef(null);
  const previouslyFocused = useRef(null);
  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    drawerRef.current?.querySelector('.drawer-close')?.focus();
    function onKeydown(event) {
      if (event.key === 'Escape') { event.preventDefault(); closeDrawer(); }
      if (event.key !== 'Tab') return;
      const focusable = [...drawerRef.current.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])')]
        .filter((node) => node.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKeydown);
    return () => {
      document.removeEventListener('keydown', onKeydown);
      if (previouslyFocused.current?.isConnected) previouslyFocused.current.focus();
    };
  }, []);
  const books = data?.books ?? [];
  const bookMap = useMemo(() => new Map(books.map((book) => [book.id, book])), [books]);
  const subtotal = cartSubtotal(items, books);
  const invalidItems = status === 'success' && items.some((item) => !bookMap.has(item.id));
  return createPortal(<div className="drawer-overlay" role="presentation" onMouseDown={(event) => {
    if (event.target === event.currentTarget) closeDrawer();
  }}>
    <aside className="umbralis-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" ref={drawerRef}>
      <header className="drawer-header">
        <div><p className="eyebrow">TU SELECCIÓN ENTRE UNIVERSOS</p><h2 id="drawer-title">El equipaje <em>del viajero</em></h2></div>
        <button className="drawer-close" type="button" onClick={closeDrawer} aria-label="Cerrar carrito">×</button>
      </header>
      <div className="drawer-body">
        <p className="drawer-status" role="status">{count === 0 ? 'El portal espera tu primera historia.' : `${count} ${count === 1 ? 'libro elegido' : 'libros elegidos'} para tu viaje.`}</p>
        {count === 0 && <div className="drawer-empty"><span aria-hidden="true">✧</span><h3>El archivo aguarda.</h3><p>Explora los mundos de Umbralis y regresa con una historia.</p><Link onClick={closeDrawer} className="btn btn-gold" to="/catalogo">Explorar el archivo ↗</Link></div>}
        {count > 0 && status === 'loading' && <p className="drawer-loading" role="status">✦ Consultando precios al archivo REST…</p>}
        {count > 0 && status === 'error' && <div className="drawer-error" role="alert"><strong>No pudimos consultar el archivo.</strong><p>{error?.message || 'Revisa la conexión al servidor.'}</p><button type="button" onClick={retry}>Reintentar consulta ↻</button></div>}
        {count > 0 && status === 'success' && <div className="drawer-items">
          {invalidItems && <p className="drawer-error" role="alert">Hay un libro que ya no está disponible. Elimínalo para continuar.</p>}
          {items.map((item) => {
            const book = bookMap.get(item.id);
            return <article className="drawer-item" key={item.id}>
              <div className={`drawer-book-icon cover-${book?.categoryId ?? 'fantasia'}`} aria-hidden="true">✧</div>
              <div className="drawer-item-details"><h3>{book?.title ?? 'Libro no disponible'}</h3><p>{book?.author ?? item.id}</p><strong>{book ? formatPrice(book.price) : 'No disponible'}</strong>
                <div className="drawer-item-actions">
                  <div className="drawer-qty" role="group" aria-label={`Cantidad de ${book?.title ?? item.id}`}>
                    <button onClick={() => decrease(item.id)} aria-label="Disminuir cantidad" type="button">−</button>
                    <output aria-label="Unidades">{item.quantity}</output>
                    <button onClick={() => increase(item.id)} disabled={item.quantity >= MAX_UNITS_PER_BOOK} aria-label="Aumentar cantidad" type="button">+</button>
                  </div><button className="drawer-remove" type="button" onClick={() => remove(item.id)}>Eliminar</button>
                </div>
              </div>
              {book && <strong className="drawer-item-subtotal">{formatPrice(book.price * item.quantity)}</strong>}
            </article>;
          })}
        </div>}
      </div>
      <footer className="drawer-footer">
        <div className="drawer-total"><span>Total referencial</span><strong>{status === 'success' ? formatPrice(subtotal) : '—'}</strong></div>
        <Link to="/carrito" onClick={closeDrawer} aria-disabled={count === 0 ? 'true' : undefined} className={`btn btn-gold drawer-checkout ${count === 0 ? 'drawer-checkout-empty' : ''}`}>Continuar al último umbral ↗</Link>
        {count > 0 && <button type="button" className="drawer-link" onClick={clear}>Vaciar carrito</button>}
        <button type="button" className="drawer-last-voucher" disabled={!lastVoucher} onClick={openVoucher}>
          {lastVoucher ? '✧ Consultar mi último comprobante' : '✧ Sin comprobantes anteriores'}
        </button>
        <p className="drawer-disclaimer">Pedidos ficticios · Sin pagos ni envíos reales</p>
      </footer>
    </aside>
  </div>, document.body);
}
