import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import BrandMark from './BrandMark.jsx';
import { useCart } from '../context/CartContext.jsx';
import CartDrawer from './CartDrawer.jsx';
import VoucherModal from './VoucherModal.jsx';

export default function SiteLayout() {
  const location = useLocation();
  const { count, cartDrawerOpen, voucherOpen, lastVoucher, openDrawer, openVoucher } = useCart();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [location.pathname]);
  return <div className="site-shell">
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <div className="topnote">UMBRALIS <span aria-hidden="true">✧</span> ARCHIVO DE MUNDOS INFINITOS <span aria-hidden="true">✧</span> EST. MMXXVI</div>
    <header className="header">
      <div className="layout-width header-inner">
        <Link className="brand" to="/" aria-label="Umbralis — Inicio">
          <BrandMark className="brand-logo" />
          <span className="brand-stack"><strong>UMBRALIS</strong><small>BIBLIOTECA DE PORTALES</small></span>
        </Link>
        <nav className="primary-nav" aria-label="Navegación principal">
          <NavLink end to="/">Inicio</NavLink>
          <NavLink to="/catalogo">El archivo</NavLink>
          <NavLink to="/nosotros">El universo</NavLink>
        </nav>
        <button type="button" onClick={openDrawer} className="header-cart" aria-label={`Abrir panel del carrito, ${count} ${count === 1 ? 'libro' : 'libros'}`}><span aria-hidden="true">✧</span> Mi carrito <span className="cart-count">{count}</span></button>
      </div>
    </header>
    <main id="contenido" className="main-content" tabIndex={-1}><Outlet /></main>
    <footer className="footer">
      <div className="layout-width footer-content">
        <div className="footer-identity">
          <p className="footer-kicker">ARCHIVO DE MUNDOS INFINITOS</p>
          <Link to="/" className="footer-brand">UMBRALIS <span aria-hidden="true">✧</span></Link>
          <p className="footer-tagline">No abras un libro.<br />Cruza el umbral.</p>
          <p className="footer-identity-note">Cada historia es una puerta. El siguiente mundo lo eliges tú.</p>
          <div className="footer-ornament" aria-hidden="true"><span /> ✦ <span /></div>
        </div>
        <div className="footer-links-panel">
          <p className="footer-nav-title">EXPLORA LOS PORTALES</p>
          <nav className="footer-nav" aria-label="Enlaces del pie de página">
            <Link to="/">Inicio</Link>
            <Link to="/catalogo">El archivo</Link>
            <Link to="/nosotros">El universo</Link>
            <button type="button" className="footer-nav-button" onClick={openDrawer}>Mi carrito ({count})</button>
            {lastVoucher && <button type="button" className="footer-nav-button" onClick={openVoucher}>Último comprobante</button>}
          </nav>
          <p className="footer-navigation-note"><span aria-hidden="true">✧</span> Un archivo, infinitos destinos.</p>
        </div>
      </div>
      <div className="layout-width footer-bottom">
        <span>© 2026 Umbralis <span className="footer-bottom-mark" aria-hidden="true">✧</span> PFY2202 · Semana 4</span>
        <span className="footer-bottom-note">Experiencia académica · Sin pagos reales</span>
      </div>
    </footer>
    {cartDrawerOpen && <CartDrawer />}
    {voucherOpen && <VoucherModal />}
  </div>;
}
