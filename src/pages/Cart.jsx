import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { BookCover, formatPrice } from '../components/BookCard.jsx';
import { ErrorPanel } from '../components/ResourceStatus.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useApiResource } from '../hooks/useApiResource.js';
import { cartSubtotal, MAX_UNITS_PER_BOOK } from '../lib/cart.js';
import { submitDemoOrder } from '../lib/orders.js';

export default function Cart() {
  const { items, increase, decrease, remove, clear, saveVoucher, lastVoucher, openVoucher } = useCart();
  const { status, data, error, retry } = useApiResource(items.length > 0 ? '/api/books' : null);
  const [customer, setCustomer] = useState({ name: '', email: '' });
  const [checkoutStatus, setCheckoutStatus] = useState('idle');
  const [checkoutError, setCheckoutError] = useState('');
  const [receipt, setReceipt] = useState(null);
  const submitted = useRef(false);
  const books = data?.books ?? [];
  const bookMap = useMemo(() => new Map(books.map((book) => [book.id, book])), [books]);
  const lines = items.map((item) => ({ ...item, book: bookMap.get(item.id) })).filter((item) => item.book);
  const invalidItems = items.length !== lines.length;
  const subtotal = cartSubtotal(items, books);

  async function checkout(event) {
    event.preventDefault();
    if (submitted.current || status !== 'success' || invalidItems || items.length === 0) return;
    submitted.current = true;
    setCheckoutStatus('loading');
    setCheckoutError('');
    try {
      const order = await submitDemoOrder({
        customer: { name: customer.name.trim(), email: customer.email.trim() },
        items: items.map(({ id, quantity }) => ({ id, quantity })),
      });
      saveVoucher(order);
      setReceipt(order);
      setCheckoutStatus('success');
      clear();
    } catch (requestError) {
      setCheckoutStatus('error');
      setCheckoutError(requestError.message);
    } finally { submitted.current = false; }
  }

  if (receipt) return <div className="layout-width cart-page">
    <div className="checkout-receipt" role="status">
      <span className="receipt-emblem" aria-hidden="true">✧</span>
      <p className="eyebrow">UMBRAL CRUZADO · PEDIDO DE DEMOSTRACIÓN</p>
      <h1>Tu próximo universo te espera.</h1>
      <p>¡Pedido simulado confirmado! <strong>{receipt.orderId}</strong></p>
      <p className="receipt-notice">No se cobraron pagos, no se enviaron libros y no se enviaron correos electrónicos.</p>
      <div className="receipt-lines">{receipt.items.map((line) => <div key={line.id}><span>{line.title} × {line.quantity}</span><strong>{formatPrice(line.lineTotal)}</strong></div>)}
        <div className="receipt-total"><span>Total simulado</span><strong>{formatPrice(receipt.total)}</strong></div>
      </div>
      <div className="receipt-actions"><button type="button" className="btn btn-gold" onClick={openVoucher}>✧ Ver / imprimir comprobante</button><Link className="btn btn-outline" to="/catalogo">Explorar otros universos ↗</Link></div>
    </div>
  </div>;

  return <div className="layout-width cart-page">
    <nav className="breadcrumb" aria-label="Ruta de navegación"><Link to="/">Inicio</Link><span aria-hidden="true">/</span><span aria-current="page">Mi carrito</span></nav>
    <p className="eyebrow">LA SELECCIÓN DEL VIAJERO</p>
    <h1>Tu equipaje <em>entre mundos.</em></h1>
    <p className="cart-intro">Cada historia que eliges es un nuevo portal. Revisa tu selección antes de realizar una compra de demostración.</p>
    {items.length === 0 ? <section className="cart-empty"><span aria-hidden="true">✧</span><h2>Tu carrito aún está vacío.</h2><p>Los mejores viajes comienzan con una historia.</p><Link to="/catalogo" className="btn btn-gold">Descubrir libros ↗</Link>{lastVoucher && <button type="button" className="btn btn-outline cart-previous-voucher" onClick={openVoucher}>✧ Ver mi última compra</button>}</section> :
      <div className="cart-columns">
        <section className="cart-list" aria-label="Libros seleccionados">
          <h2>Los mundos elegidos <small>{items.length} {items.length === 1 ? 'título' : 'títulos'}</small></h2>
          {status === 'loading' && <div className="detail-loading" role="status"><span className="spinner" aria-hidden="true"/> Consultando los precios desde REST…</div>}
          {status === 'error' && <ErrorPanel error={error} onRetry={retry} />}
          {status === 'success' && <>
            {invalidItems && <div className="cart-inline-error" role="alert">Uno de tus libros ya no existe en el catálogo. Elimínalo para continuar.</div>}
            {items.map((item) => {
              const book = bookMap.get(item.id);
              return <article className="cart-line" key={item.id}>
                {book ? <Link to={`/libro/${book.id}`} className="cart-cover-link" aria-label={`Ver ${book.title}`}><BookCover book={book} /></Link> : <div className="cart-cover-missing" aria-hidden="true">?</div>}
                <div className="cart-line-info">
                  <p className="eyebrow">{book?.categoryId?.replace('-', ' ') ?? 'TÍTULO NO DISPONIBLE'}</p>
                  <h3>{book ? <Link to={`/libro/${book.id}`}>{book.title}</Link> : item.id}</h3>
                  <p>{book?.author ?? 'No disponible'}</p>
                  <strong>{book ? formatPrice(book.price) : '—'}</strong>
                  <div className="cart-line-actions">
                    <div className="qty-control" role="group" aria-label={`Cantidad de ${book?.title ?? item.id}`}>
                      <button type="button" aria-label={`Quitar una unidad de ${book?.title ?? item.id}`} onClick={() => decrease(item.id)}>−</button>
                      <output aria-label="Cantidad">{item.quantity}</output>
                      <button type="button" aria-label={`Agregar una unidad de ${book?.title ?? item.id}`} disabled={item.quantity >= MAX_UNITS_PER_BOOK} onClick={() => increase(item.id)}>+</button>
                    </div>
                    <button type="button" className="cart-remove" onClick={() => remove(item.id)}>Eliminar</button>
                  </div>
                </div>
                {book && <strong className="cart-line-total">{formatPrice(book.price * item.quantity)}</strong>}
              </article>;
            })}
            <button type="button" className="clear-cart" onClick={clear}>Vaciar carrito</button>
          </>}
        </section>
        <aside className="cart-checkout" aria-label="Resumen y simulación de compra">
          <p className="eyebrow">EL ÚLTIMO UMBRAL</p><h2>Resumen del pedido</h2>
          <div className="cart-summary-row"><span>Subtotal</span><strong>{status === 'success' ? formatPrice(subtotal) : '—'}</strong></div>
          <div className="cart-summary-row"><span>Envío</span><span>Solo demostración</span></div>
          <div className="cart-summary-total"><span>Total referencial</span><strong>{status === 'success' ? formatPrice(subtotal) : '—'}</strong></div>
          <form onSubmit={checkout} className="checkout-form">
            <label htmlFor="buyer-name">Nombre para el pedido demo</label>
            <input id="buyer-name" name="name" autoComplete="name" minLength={2} maxLength={90} required value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} placeholder="Tu nombre" />
            <label htmlFor="buyer-email">Correo de demostración</label>
            <input id="buyer-email" name="email" type="email" autoComplete="email" maxLength={150} required value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} placeholder="correo@ejemplo.com" />
            {checkoutError && <p className="cart-inline-error" role="alert">{checkoutError} Puedes reintentar sin perder tu carrito.</p>}
            <button className="btn btn-gold checkout-submit" type="submit" disabled={status !== 'success' || invalidItems || checkoutStatus === 'loading'}>
              {checkoutStatus === 'loading' ? 'Confirmando portal…' : 'Confirmar pedido de prueba ↗'}
            </button>
          </form>
          {lastVoucher && <button className="cart-last-voucher-link" type="button" onClick={openVoucher}>✧ Ver último comprobante</button>}
          <p className="checkout-disclaimer">✧ Esta es una simulación académica. No solicitamos tarjetas, no se cobra dinero y no se almacenan tus datos personales.</p>
        </aside>
      </div>}
  </div>;
}
