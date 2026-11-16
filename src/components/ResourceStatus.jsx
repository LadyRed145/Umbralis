import { Link } from 'react-router';

export function LoadingGrid({ message = 'Buscando nuevas historias…', count = 6 }) {
  return <section aria-busy="true" aria-live="polite" className="results-state">
    <p className="loading-message"><span className="spinner" aria-hidden="true" />{message}</p>
    <div className="book-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => <div className="skeleton-book" key={index}>
        <div className="skeleton-cover" /><span className="skeleton-line" /><span className="skeleton-line short" />
      </div>)}
    </div>
  </section>;
}

export function ErrorPanel({ error, onRetry }) {
  return <section className="error-panel" role="alert">
    <span className="error-symbol" aria-hidden="true">!</span>
    <div>
      <p className="eyebrow">UN DESVÍO ENTRE MUNDOS</p>
      <h2>El portal no respondió</h2>
      <p>{error?.message || 'Ocurrió un error inesperado.'}</p>
      <p className="error-hint">{error?.status === 404
        ? 'Revisa la dirección o vuelve al catálogo completo.'
        : 'Comprueba la conexión y que el servidor mock esté funcionando; también puedes reintentar.'}</p>
      <div className="action-row">
        <button type="button" className="btn btn-dark" onClick={onRetry}>↻ Reintentar</button>
        <Link className="btn btn-outline" to="/catalogo">Volver al archivo</Link>
      </div>
    </div>
  </section>;
}

export function EmptyState({ title = 'No encontramos coincidencias', message = 'Prueba otra búsqueda o explora todas nuestras categorías.', onReset }) {
  return <div className="empty-state">
    <span className="empty-mark" aria-hidden="true">⌕</span>
    <h2>{title}</h2><p>{message}</p>
    {onReset && <button className="btn btn-outline" type="button" onClick={onReset}>Limpiar filtros</button>}
  </div>;
}
