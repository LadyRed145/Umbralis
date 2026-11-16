import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../context/CartContext.jsx';
import VoucherDocument from './VoucherDocument.jsx';

/** Vista previa con impresión directa o "Guardar como PDF" del navegador. */
export default function VoucherModal() {
  const { lastVoucher, closeVoucher } = useCart();
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);
  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    dialogRef.current?.querySelector('.voucher-close')?.focus();
    function onKeydown(event) {
      if (event.key === 'Escape') { event.preventDefault(); closeVoucher(); }
      if (event.key !== 'Tab') return;
      const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled])')];
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKeydown);
    return () => {
      document.removeEventListener('keydown', onKeydown);
      if (previouslyFocused.current?.isConnected) previouslyFocused.current.focus();
    };
  }, []);
  if (!lastVoucher) return null;
  return createPortal(<div className="voucher-overlay" role="presentation" onMouseDown={(event) => {
    if (event.target === event.currentTarget) closeVoucher();
  }}>
    <section className="voucher-dialog" role="dialog" aria-modal="true" aria-labelledby="voucher-modal-title" ref={dialogRef}>
      <header className="voucher-dialog-head"><div><p className="eyebrow">UN RECUERDO DE TU TRAVESÍA</p><h2 id="voucher-modal-title">Comprobante de Umbralis</h2></div>
        <button className="voucher-close" type="button" onClick={closeVoucher} aria-label="Cerrar comprobante">×</button>
      </header>
      <div className="voucher-dialog-body"><VoucherDocument voucher={lastVoucher} /></div>
      <footer className="voucher-dialog-actions"><button type="button" className="btn btn-gold" onClick={() => window.print()}>✧ Guardar como PDF / Imprimir</button>
        <button type="button" className="btn btn-outline" onClick={closeVoucher}>Cerrar el archivo</button></footer>
    </section>
  </div>, document.body);
}
