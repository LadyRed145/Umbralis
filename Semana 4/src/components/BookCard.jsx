import { Link } from 'react-router';
import { useCart } from '../context/CartContext.jsx';
import { MAX_UNITS_PER_BOOK } from '../lib/cart.js';

export const formatPrice = (price) => new Intl.NumberFormat('es-CL', {
  style: 'currency', currency: 'CLP', maximumFractionDigits: 0,
}).format(price);

export function BookCover({ book, className = '' }) {
  return <div className={`book-cover cover-${book.categoryId} ${className}`} aria-hidden="true">
    <span className="cover-corner">U / M</span>
    <span className="cover-ornament">{({ 'clasicos': '❦', 'terror': '☾', 'fantasia': '✧', 'ciencia-ficcion': '✳', 'misterio': '⌕', 'romance': '♡' })[book.categoryId] ?? '✦'}</span>
    <span className="cover-copy"><span className="cover-title">{book.title}</span><span className="cover-author">{book.author}</span></span>
    <span className="cover-footer">ARCHIVO · UMBRALIS</span>
  </div>;
}

export default function BookCard({ book, category }) {
  const { add, items } = useCart();
  const atLimit = (items.find((item) => item.id === book.id)?.quantity ?? 0) >= MAX_UNITS_PER_BOOK;
  return <article className="book-card">
    <Link className="book-cover-link" to={`/libro/${encodeURIComponent(book.id)}`} aria-label={`Ver detalles de ${book.title}`}>
      <BookCover book={book} />
      <span className="cover-view">Abrir portal ↗</span>
    </Link>
    <div className="book-card-info">
      <div className="book-meta"><span>{category?.name ?? 'Colección'}</span><span>{book.year}</span></div>
      <h3 className="book-heading"><Link to={`/libro/${encodeURIComponent(book.id)}`}>{book.title}</Link></h3>
      <p className="book-author-line">{book.author}</p>
    </div>
    <div className="book-card-actions">
      <div className="book-card-bottom"><strong>{formatPrice(book.price)}</strong><Link to={`/libro/${book.id}`} aria-label={`Leer descripción de ${book.title}`}>Ver más <span aria-hidden="true">↗</span></Link></div>
      <button className="book-add-button" type="button" onClick={() => add(book)} disabled={atLimit}>{atLimit ? 'Máximo en el carrito' : '+ Agregar al carrito'}</button>
    </div>
  </article>;
}
