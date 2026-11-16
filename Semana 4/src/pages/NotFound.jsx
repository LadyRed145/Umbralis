import { Link } from 'react-router';
export default function NotFound() {
  return <div className="layout-width not-found"><span aria-hidden="true">404</span><p className="eyebrow">PORTAL INEXISTENTE</p><h1>Este umbral no existe.</h1><p>Parece que esta puerta conduce al vacío. El archivo sigue abierto.</p><Link className="btn btn-dark" to="/catalogo">Volver al archivo ↗</Link></div>;
}
