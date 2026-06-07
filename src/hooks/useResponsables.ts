import { useState, useEffect } from 'react';

const DEFAULT_RESPONSABLES = [
  'SALVADOR PALMERO',
  'JESÚS LOPEZ',
  'JUAN GONZÁLEZ',
  'JOSÉ BELLIDO',
];

const STORAGE_KEY = 'donca_responsables_servicio';

export function useResponsables() {
  const [responsables, setResponsables] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setResponsables(JSON.parse(saved));
      } catch {
        setResponsables(DEFAULT_RESPONSABLES);
      }
    } else {
      setResponsables(DEFAULT_RESPONSABLES);
    }
  }, []);

  const addResponsable = (nombre: string) => {
    const trimmed = nombre.trim().toUpperCase();
    if (trimmed && !responsables.includes(trimmed)) {
      const updated = [...responsables, trimmed];
      setResponsables(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const removeResponsable = (nombre: string) => {
    const updated = responsables.filter((p) => p !== nombre);
    setResponsables(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { responsables, addResponsable, removeResponsable };
}
