import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { useApiResource } from '../hooks/useApiResource.js';
import BookCard from '../components/BookCard.jsx';
import SortControl from '../components/SortControl.jsx';
import { EmptyState, ErrorPanel, LoadingGrid } from '../components/ResourceStatus.jsx';

export default function Catalog() {
  const { category: selectedCategory } = useParams();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('name');
  const demoError = ['404', '500'].includes(searchParams.get('demoError')) ? searchParams.get('demoError') : null;
  const booksPath = demoError ? `/api/books?simulate=${demoError}` : selectedCategory ? `/api/books?category=${encodeURIComponent(selectedCategory)}` : '/api/books';
  const booksResource = useApiResource(booksPath);
  const categoriesResource = useApiResource('/api/categories');
  const categories = categoriesResource.data?.categories ?? [];
  const currentCategory = categories.find((item) => item.id === selectedCategory);
  const categoryMap = useMemo(() => Object.fromEntries(categories.map((item) => [item.id, item])), [categories]);
  const books = useMemo(() => {
    const normalized = search.toLocaleLowerCase('es').trim();
    const filtered = (booksResource.data?.books ?? []).filter((book) => (`${book.title} ${book.author}`).toLocaleLowerCase('es').includes(normalized));
    return [...filtered].sort((a, b) => {
      if (order === 'year') return b.year - a.year;
      if (order === 'price-asc') return a.price - b.price;
      if (order === 'price-desc') return b.price - a.price;
      return a.title.localeCompare(b.title, 'es');
    });
  }, [booksResource.data, search, order]);

  return <div className="layout-width catalog-page">
    <nav className="breadcrumb" aria-label="Ruta de navegación"><Link to="/">Inicio</Link><span aria-hidden="true">/</span>{selectedCategory && <><Link to="/catalogo">Catálogo</Link><span aria-hidden="true">/</span></>}<span aria-current="page">{currentCategory?.name ?? (selectedCategory ? 'Categoría' : 'Catálogo')}</span></nav>
    <div className="catalog-heading"><div><p className="eyebrow">EL ARCHIVO UMBRALIS</p><h1>{selectedCategory ? (currentCategory?.name ?? 'Explorar dimensión') : 'El archivo de los mundos.'}</h1><p>{selectedCategory ? (currentCategory?.detail ?? 'Selección de libros de esta colección.') : 'Cada título es una puerta. Encuentra la que te está esperando.'}</p></div><span className="catalog-heading-symbol" aria-hidden="true">✧</span></div>

    <div className="catalog-layout">
      <aside className="catalog-sidebar" aria-label="Filtrar por categoría">
        <p className="sidebar-title">CATEGORÍAS</p>
        {categoriesResource.status === 'loading' && <p role="status" className="muted">Cargando categorías…</p>}
        {categoriesResource.status === 'error' && <div className="sidebar-error"><p>No se cargaron las categorías.</p><button type="button" onClick={categoriesResource.retry}>Reintentar</button></div>}
        {categoriesResource.status === 'success' && <nav className="category-nav" aria-label="Categorías literarias">
          <Link className={!selectedCategory ? 'active' : ''} to="/catalogo">Todas las categorías <span>{categories.reduce((sum, item) => sum + item.count, 0)}</span></Link>
          {categories.map((category) => <Link className={selectedCategory === category.id ? 'active' : ''} key={category.id} to={`/categoria/${category.id}`}><span className="cat-nav-name"><i aria-hidden="true">{category.icon}</i> {category.name}</span><span>{category.count}</span></Link>)}
        </nav>}
        <div className="sidebar-note"><span aria-hidden="true">✦</span><p>Cada género es un umbral. Cada lectura, otro universo.</p></div>
      </aside>
      <section className="catalog-results" aria-label="Listado de libros">
        <div className="catalog-toolbar">
          <label className="search-field"><span className="visually-hidden">Buscar por título o autor</span><span aria-hidden="true">⌕</span><input type="search" placeholder="Buscar título o autor…" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <SortControl value={order} onChange={setOrder} />
        </div>
        {booksResource.status === 'loading' && <LoadingGrid message="Cargando catálogo desde REST…" count={6} />}
        {booksResource.status === 'error' && <ErrorPanel error={booksResource.error} onRetry={booksResource.retry} />}
        {booksResource.status === 'success' && <>
          <div className="results-bar"><span><strong>{books.length}</strong> {books.length === 1 ? 'libro encontrado' : 'libros encontrados'}</span><span>Catálogo de demostración</span></div>
          {books.length > 0 ? <div className="book-grid catalog-book-grid">{books.map((book) => <BookCard key={book.id} book={book} category={categoryMap[book.categoryId]} />)}</div> : <EmptyState onReset={() => setSearch('')} />}
        </>}
      </section>
    </div>
  </div>;
}
