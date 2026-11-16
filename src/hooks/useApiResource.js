import { useEffect, useState } from 'react';
import { getResource } from '../lib/api.js';

/** Hook genérico para estados loading / success / error y reintento manual. */
export function useApiResource(path) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ path, status: 'loading', data: null, error: null });

  useEffect(() => {
    if (!path) return undefined;
    let active = true;
    // El efecto puede montarse dos veces en StrictMode; getResource une peticiones simultáneas.
    getResource(path, { force: attempt > 0 }).then(
      (data) => { if (active) setState({ path, status: 'success', data, error: null }); },
      (error) => { if (active) setState({ path, status: 'error', data: null, error }); },
    );
    return () => { active = false; };
  }, [path, attempt]);

  const retry = () => {
    setState({ path, status: 'loading', data: null, error: null });
    setAttempt((value) => value + 1);
  };
  // Impide mostrar datos antiguos un fotograma cuando cambia el endpoint.
  return { ...(state.path === path ? state : { path, status: 'loading', data: null, error: null }), retry };
}
