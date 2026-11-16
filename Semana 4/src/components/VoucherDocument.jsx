import BrandMark from './BrandMark.jsx';
import { formatPrice } from './BookCard.jsx';
import { voucherDate, voucherUnits } from '../lib/voucher.js';

/** Voucher archivístico inspirado en NatGamez y reinterpretado como pergamino Umbralis. */
export default function VoucherDocument({ voucher }) {
  if (!voucher) return null;
  const units = voucherUnits(voucher);
  return <article className="voucher-document" id="comprobante-umbralis">
    <div className="voucher-gold-rule" aria-hidden="true" />
    <header className="voucher-head">
      <div><p className="voucher-kicker">ARCHIVO DE TRAVESÍAS · COPIA DE DEMOSTRACIÓN</p><h2>UMBRALIS</h2>
        <p className="voucher-subtitle">Certificado de cruce entre universos</p>
        <p className="voucher-welcome">Tu selección ha quedado registrada en el archivo de los mundos posibles.</p>
      </div>
      <BrandMark className="voucher-mark" />
    </header>
    <div className="voucher-facts">
      <div><span>Folio</span><strong>{voucher.orderId}</strong></div>
      <div><span>Fecha y hora</span><strong>{voucherDate(voucher.createdAt)}</strong></div>
      <div><span>Estado</span><strong className="voucher-confirmed">Confirmado · Demo</strong></div>
      <div><span>Operación</span><strong>Compra simulada</strong></div>
      <div><span>Entrega</span><strong>No aplica · Demo</strong></div>
      <div><span>Ejemplares</span><strong>{units}</strong></div>
    </div>
    <div className="voucher-table-scroll"><table className="voucher-table">
      <thead><tr><th scope="col">Libro / Autor</th><th scope="col">Unid.</th><th scope="col">Precio</th><th scope="col">Subtotal</th></tr></thead>
      <tbody>{voucher.items.map((item) => <tr key={item.id}>
        <td><div className="voucher-book-cell"><span className={`voucher-book-symbol cover-${item.categoryId || 'fantasia'}`} aria-hidden="true">✧</span>
          <div><strong>{item.title}</strong><small>{item.author || 'Archivo Umbralis'}</small></div></div></td>
        <td>{item.quantity}</td><td>{formatPrice(item.unitPrice)}</td><td className="voucher-book-sum">{formatPrice(item.lineTotal)}</td>
      </tr>)}</tbody>
    </table></div>
    <div className="voucher-final">
      <div><span>{voucher.items.length} {voucher.items.length === 1 ? 'título diferente' : 'títulos diferentes'}</span><small>{units} {units === 1 ? 'ejemplar' : 'ejemplares'} en el archivo</small></div>
      <div><span>Total referencial</span><strong>{formatPrice(voucher.total)}</strong></div>
    </div>
    <footer className="voucher-tail"><span className="voucher-sigil" aria-hidden="true">✧</span><strong>No abras un libro. Cruza el umbral.</strong>
      <p>Comprobante académico de una <b>compra simulada</b>. No es boleta tributaria ni acredita un pago, cobro, envío o adquisición comercial real.</p>
      <small>UMBRALIS · ARCHIVO DE MUNDOS INFINITOS · MMXXVI</small>
    </footer>
  </article>;
}
