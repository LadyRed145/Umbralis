import { ApiError } from './api.js';

/** POST no se cachea: las compras de prueba siempre generan un pedido nuevo. */
export async function submitDemoOrder(payload, { fetchImpl = fetch, timeoutMs = 9000 } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal: controller.signal,
      body: JSON.stringify(payload),
    });
    if (!response.headers.get('content-type')?.includes('application/json')) throw new ApiError('El servidor respondió con un formato inesperado.', { code: 'INVALID_RESPONSE' });
    const result = await response.json();
    if (!response.ok) {
      throw new ApiError(result.error || 'No fue posible confirmar el pedido de demostración.', {
        code: result.code ?? 'ORDER_ERROR', status: response.status,
      });
    }
    return result;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error.name === 'AbortError') throw new ApiError('El pedido tardó demasiado. Verifica el servidor antes de reintentar.', { code: 'TIMEOUT' });
    throw new ApiError('No se pudo contactar al servidor. El carrito se ha conservado.', { code: 'NETWORK_ERROR' });
  } finally { clearTimeout(timeout); }
}
