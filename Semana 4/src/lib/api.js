/** Cliente HTTP con gestión de errores, expiración de caché y peticiones compartidas. */
const cache = new Map();
const DEFAULT_TTL = 60_000;

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'NETWORK_ERROR' } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export async function requestJSON(path, { fetchImpl = fetch, timeoutMs = 8_000 } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(path, {
      method: 'GET',
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      if (response.status === 404) throw new ApiError('No encontramos los datos solicitados.', { status: 404, code: 'NOT_FOUND' });
      if (response.status >= 500) throw new ApiError('El servicio no está disponible temporalmente.', { status: response.status, code: 'SERVER_ERROR' });
      throw new ApiError('No pudimos completar la solicitud.', { status: response.status, code: 'HTTP_ERROR' });
    }
    const contentType = response.headers?.get('content-type') ?? '';
    if (!contentType.toLowerCase().includes('application/json')) {
      throw new ApiError('La respuesta del servicio no es JSON.', { code: 'INVALID_RESPONSE' });
    }
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error?.name === 'AbortError') {
      throw new ApiError('La solicitud demoró demasiado. Intenta nuevamente.', { code: 'TIMEOUT' });
    }
    if (error instanceof SyntaxError) {
      throw new ApiError('Los datos recibidos no tienen un formato válido.', { code: 'INVALID_JSON' });
    }
    throw new ApiError('No fue posible conectar con el servidor de libros.', { code: 'NETWORK_ERROR' });
  } finally {
    clearTimeout(timeout);
  }
}

export function clearApiCache(path) {
  if (path === undefined) cache.clear();
  else cache.delete(path);
}

/** Evita solicitudes simultáneas duplicadas y reutiliza datos recientes durante 60 s. */
export function getResource(path, {
  force = false,
  ttlMs = DEFAULT_TTL,
  fetchImpl,
  timeoutMs,
} = {}) {
  if (force) cache.delete(path);
  const now = Date.now();
  const entry = cache.get(path);
  if (entry?.promise) return entry.promise;
  if (entry && entry.expiresAt > now) return Promise.resolve(entry.data);

  const pending = requestJSON(path, { fetchImpl, timeoutMs });
  cache.set(path, { promise: pending });
  pending.then(
    (data) => {
      if (cache.get(path)?.promise === pending) {
        cache.set(path, { data, expiresAt: Date.now() + ttlMs });
      }
    },
    () => {
      if (cache.get(path)?.promise === pending) cache.delete(path);
    },
  );
  return pending;
}
