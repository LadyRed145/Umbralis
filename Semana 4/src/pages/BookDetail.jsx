import { Link, useParams } from 'react-router';
import { BookCover, formatPrice } from '../components/BookCard.jsx';
import { ErrorPanel } from '../components/ResourceStatus.jsx';
import { useApiResource } from '../hooks/useApiResource.js';
import { useCart } from '../context/CartContext.jsx';
import { MAX_UNITS_PER_BOOK } from '../lib/cart.js';

export default function BookDetail() {
  const { id } = useParams();
  const { status, data, error, retry } = useApiResource(`/api/books/${encodeURIComponent(id)}`);
  const book = data?.book;
  const { add, items } = useCart();
  const atLimit = (items.find((item) => item.id === id)?.quantity ?? 0) >= MAX_UNITS_PER_BOOK;
  return <div className="layout-width detail-page">
    <nav className="breadcrumb" aria-label="Ruta de navegación"><Link to="/">Inicio</Link><span aria-hidden="true">/</span><Link to="/catalogo">Catálogo</Link><span aria-hidden="true">/</span><span aria-current="page">{book?.title ?? 'Libro'}</span></nav>
    {status === 'loading' && <div className="detail-loading" role="status"><span className="spinner" aria-hidden="true" /> Cargando libro…</div>}
    {status === 'error' && <ErrorPanel error={error} onRetry={retry} />}
    {status === 'success' && book && <div className="detail-layout">
      <div className="detail-cover-stage"><BookCover book={book} className="detail-cover" /></div>
      <div className="detail-copy"><p className="eyebrow">ARCHIVO UMBRALIS · EDICIÓN DEMO</p><h1>{book.title}</h1><p className="detail-author">Una obra de <strong>{book.author}</strong></p><div className="detail-rule" /><h2>Tras el umbral</h2><p className="detail-blurb">{book.blurb}</p>
        <dl className="detail-specs"><div><dt>Publicado en</dt><dd>{book.year}</dd></div><div><dt>Extensión aproximada</dt><dd>{book.pages} páginas</dd></div><div><dt>Precio referencial</dt><dd>{formatPrice(book.price)}</dd></div></dl>
        <p className="detail-disclaimer">Compra simulada para fines académicos, sin cobros ni envíos reales.</p>
        <div className="action-row"><button className="btn btn-gold" disabled={atLimit} type="button" onClick={() => add(book)}>{atLimit ? 'Máximo en el carrito' : '+ Agregar al carrito'}</button><Link to="/carrito" className="btn btn-outline">Ver mi carrito ↗</Link></div>
        <Link to="/catalogo" className="detail-back-link">← Volver al archivo</Link>
      </div>
    </div>}
  </div>;
}
