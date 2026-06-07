import type { FormularioData } from '../types';

const STORAGE_KEY = 'parte-incidencias-borrador';

export function guardarBorrador(data: Partial<FormularioData>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn('No se pudo guardar el borrador en localStorage');
  }
}

export function cargarBorrador(): Partial<FormularioData> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<FormularioData>;
  } catch {
    return null;
  }
}

export function limpiarBorrador(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.warn('No se pudo limpiar el borrador');
  }
}
