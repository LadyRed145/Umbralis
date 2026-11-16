import { useEffect, useId, useRef, useState } from 'react';

const OPTIONS = [
  { value: 'name', label: 'Título A–Z' },
  { value: 'year', label: 'Más recientes' },
  { value: 'price-asc', label: 'Menor precio' },
  { value: 'price-desc', label: 'Mayor precio' },
];

/**
 * Selector de ordenación integrado en la página.
 * Evita el desplegable nativo del navegador, que puede dibujarse fuera
 * del ancho del dispositivo al emular móviles en Chromium/Brave.
 */
export default function SortControl({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const optionsId = useId();
  const selected = OPTIONS.find((option) => option.value === value) ?? OPTIONS[0];

  useEffect(() => {
    if (!open) return undefined;

    const dismissOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    const dismissEscape = (event) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('pointerdown', dismissOutside);
    document.addEventListener('keydown', dismissEscape);
    return () => {
      document.removeEventListener('pointerdown', dismissOutside);
      document.removeEventListener('keydown', dismissEscape);
    };
  }, [open]);

  const selectOption = (option) => {
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="sort-field">
      <span>Ordenar:</span>
      <div className="sort-menu" ref={wrapperRef}>
        <button
          type="button"
          ref={triggerRef}
          className="sort-menu-trigger"
          aria-label={`Ordenar libros: ${selected.label}`}
          aria-expanded={open}
          aria-controls={optionsId}
          onClick={() => setOpen((previous) => !previous)}
        >
          <span>{selected.label}</span>
          <span className="sort-menu-chevron" aria-hidden="true">⌄</span>
        </button>
        {open && (
          <div className="sort-menu-options" id={optionsId} role="group" aria-label="Opciones de ordenación">
            {OPTIONS.map((option) => (
              <button
                type="button"
                key={option.value}
                className={`sort-menu-option${option.value === value ? ' is-selected' : ''}`}
                aria-pressed={option.value === value}
                onClick={() => selectOption(option)}
              >
                <span>{option.label}</span>
                {option.value === value && <span aria-hidden="true">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
