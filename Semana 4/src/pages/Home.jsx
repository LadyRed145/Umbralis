import { Link } from 'react-router';
import { useApiResource } from '../hooks/useApiResource.js';
import { LoadingGrid, ErrorPanel } from '../components/ResourceStatus.jsx';
import BookCard from '../components/BookCard.jsx';
import PortalArt from '../components/PortalArt.jsx';

const featuredIds = ['dracula', 'alicia', 'sherlock', 'orgullo-prejuicio'];

export default function Home() {
  const categoriesResource = useApiResource('/api/categories');
  const booksResource = useApiResource('/api/books');
  const categories = categoriesResource.data?.categories ?? [];
  const books = booksResource.data?.books ?? [];
  const categoriesById = Object.fromEntries(categories.map((category) => [category.id, category]));
  const featured = featuredIds.map((id) => books.find((book) => book.id === id)).filter(Boolean);

  return <>
    <section className="hero">
      <div className="layout-width hero-inner">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span aria-hidden="true">✧</span> BIENVENIDO AL ARCHIVO DE LOS MUNDOS</p>
          <h1>No abras un libro. <em>Cruza el umbral.</em></h1>
          <p className="hero-subtitle">Más allá de la última página existen mil realidades. Un portal para cada historia. Una historia para cada alma curiosa.</p>
          <div className="action-row"><Link className="btn btn-gold" to="/catalogo">Atravesar el portal <span aria-hidden="true">↗</span></Link><a className="hero-text-link" href="#colecciones">Descubrir dimensiones ↓</a></div>
          <div className="hero-stats"><div><strong>{booksResource.status === 'success' ? String(books.length).padStart(2, '0') : '—'}</strong><span>historias por cruzar</span></div><i /><div><strong>{categoriesResource.status === 'success' ? String(categories.length).padStart(2, '0') : '—'}</strong><span>dimensiones abiertas</span></div></div>
        </div>
        <PortalArt />
      </div>
      <div className="hero-bottom layout-width"><span>UNA BIBLIOTECA. INFINITOS DESTINOS.</span><span>ARCHIVO · VOLUMEN I · MMXXVI</span></div>
    </section>

    <section className="section section-categories layout-width" id="colecciones">
      <div className="section-head"><div><p className="eyebrow">ELIGE TU DESTINO <span aria-hidden="true">✧</span></p><h2>Seis puertas. <em>Infinitos mundos.</em></h2></div><Link className="section-link" to="/catalogo">Explorar el archivo ↗</Link></div>
      {categoriesResource.status === 'loading' && <LoadingGrid message="Consultando dimensiones de la API…" count={3} />}
      {categoriesResource.status === 'error' && <ErrorPanel error={categoriesResource.error} onRetry={categoriesResource.retry} />}
      {categoriesResource.status === 'success' && <div className="categories-grid">
        {categories.map((category, index) => <Link to={`/categoria/${category.id}`} className={`category-tile category-${category.theme}`} key={category.id}>
          <span className="category-index">UMBRAL {String(index + 1).padStart(2, '0')}</span>
          <span className="category-icon" aria-hidden="true">{category.icon}</span><span className="category-name">{category.name}</span>
          <span className="category-detail">{category.detail}</span><span className="category-bottom">{category.count} {category.count === 1 ? 'historia' : 'historias'} <span aria-hidden="true">↗</span></span>
        </Link>)}
      </div>}
    </section>

    <section className="section featured-section">
      <div className="layout-width">
        <div className="section-head"><div><p className="eyebrow">DEL ARCHIVO DE UMBRALIS</p><h2>Historias que <em>te encuentran.</em></h2></div><Link className="section-link" to="/catalogo">Ver todas las historias ↗</Link></div>
        {booksResource.status === 'loading' && <LoadingGrid message="Consultando libros destacados…" count={4} />}
        {booksResource.status === 'error' && <ErrorPanel error={booksResource.error} onRetry={booksResource.retry} />}
        {booksResource.status === 'success' && (featured.length > 0
          ? <div className="book-grid featured-grid">{featured.map((book) => <BookCard key={book.id} book={book} category={categoriesById[book.categoryId]} />)}</div>
          : <p className="muted">Todavía no hay historias destacadas para mostrar.</p>)}
      </div>
    </section>
    <section className="closing-banner layout-width"><div><p className="eyebrow">TU PRÓXIMO DESTINO TE ESPERA</p><h2>Hay puertas que solo <em>se abren leyendo.</em></h2><p>El archivo está abierto. ¿Qué mundo vas a cruzar primero?</p></div><Link className="btn btn-dark" to="/catalogo">Entrar al archivo ↗</Link></section>
  </>;
}
