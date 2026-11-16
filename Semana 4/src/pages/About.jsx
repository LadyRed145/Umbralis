import { Link } from 'react-router';

export default function About() {
  return <div className="layout-width about-page">
    <p className="eyebrow">EL PROYECTO</p><h1>Un portal hacia las historias. <em>Una arquitectura que funciona.</em></h1>
    <p className="about-lead">Umbralis es una librería de portales literarios creada con React. Bajo su estética de fantasía oscura, demuestra la integración real entre una interfaz frontend y una API REST simulada.</p>
    <div className="about-feature-grid">
      <div><span>01</span><h2>REST mock real</h2><p>Un servidor HTTP local proporciona categorías y libros con GET y confirma pedidos ficticios mediante POST.</p></div>
      <div><span>02</span><h2>Estados transparentes</h2><p>La interfaz comunica la carga, los resultados, la ausencia de coincidencias y los errores de red o HTTP.</p></div>
      <div><span>03</span><h2>Consultas eficientes</h2><p>Caché con expiración y peticiones compartidas evitan consultas repetidas. El carrito persiste localmente y los pedidos de prueba no cobran dinero.</p></div>
    </div>
    <div className="about-foot"><p>Proyecto individual · Desarrollo Frontend II · PFY2202 · Semana 4</p><Link to="/catalogo" className="btn btn-dark">Cruzar el umbral ↗</Link></div>
  </div>;
}
