import { categories, books } from './data.mjs';
import { readJson, createDemoOrder } from './orders.mjs';

const json = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify(body));
};

/** Handler REST de solo lectura; exportado para pruebas HTTP de extremo a extremo. */
export function createHandler({ delayMs = 240 } = {}) {
  return async (req, res) => {
    const origin = `http://${req.headers.host ?? 'localhost'}`;
    let url;
    try { url = new URL(req.url ?? '/', origin); }
    catch { json(res, 400, { error: 'URL inválida', code: 'BAD_REQUEST' }); return; }

    if (url.pathname === '/api/orders') {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        json(res, 405, { error: 'Los pedidos de prueba requieren POST.', code: 'METHOD_NOT_ALLOWED' });
        return;
      }
      if (!(req.headers['content-type'] ?? '').startsWith('application/json')) {
        json(res, 415, { error: 'Envía el pedido como application/json.', code: 'UNSUPPORTED_MEDIA_TYPE' });
        return;
      }
      try {
        const payload = await readJson(req);
        if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
        const result = createDemoOrder(payload);
        json(res, result.status, result.body);
      } catch (error) {
        const tooLarge = error.code === 'PAYLOAD_TOO_LARGE';
        json(res, tooLarge ? 413 : 400, { error: error.message, code: error.code ?? 'INVALID_REQUEST' });
      }
      return;
    }

    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      json(res, 405, { error: 'Solo se permiten solicitudes GET para consultar el catálogo.', code: 'METHOD_NOT_ALLOWED' });
      return;
    }

    if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));

    // Simulador documentado: permite al docente comprobar el componente de errores.
    const simulated = url.searchParams.get('simulate');
    if (simulated === '500' || simulated === '404') {
      const status = Number(simulated);
      json(res, status, {
        error: status === 500 ? 'Error interno simulado.' : 'Recurso no encontrado (simulado).',
        code: status === 500 ? 'SIMULATED_SERVER_ERROR' : 'SIMULATED_NOT_FOUND',
      });
      return;
    }

    if (url.pathname === '/api/health') {
      json(res, 200, { status: 'ok', service: 'Umbralis REST mock' });
    } else if (url.pathname === '/api/categories') {
      json(res, 200, {
        categories: categories.map((category) => ({
          ...category,
          count: books.filter((book) => book.categoryId === category.id).length,
        })),
        total: categories.length,
      });
    } else if (url.pathname === '/api/books') {
      const category = url.searchParams.get('category');
      const query = url.searchParams.get('q')?.trim().toLocaleLowerCase('es') ?? '';
      if (category && !categories.some((item) => item.id === category)) {
        json(res, 404, { error: 'La categoría solicitada no existe.', code: 'CATEGORY_NOT_FOUND' });
        return;
      }
      const selected = books.filter((book) => (
        (!category || book.categoryId === category) &&
        (!query || `${book.title} ${book.author}`.toLocaleLowerCase('es').includes(query))
      ));
      json(res, 200, { books: selected, total: selected.length });
    } else if (/^\/api\/books\/[^/]+$/.test(url.pathname)) {
      const id = decodeURIComponent(url.pathname.slice('/api/books/'.length));
      const book = books.find((item) => item.id === id);
      if (!book) {
        json(res, 404, { error: 'El libro solicitado no existe.', code: 'BOOK_NOT_FOUND' });
        return;
      }
      json(res, 200, { book });
    } else {
      json(res, 404, { error: 'Ruta REST no encontrada.', code: 'NOT_FOUND' });
    }
  };
}
