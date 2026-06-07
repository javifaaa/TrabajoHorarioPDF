import { useState, useEffect } from 'react';

const DEFAULT_PERSONAL = [
  'RAFAEL PALLARÉS',
  'FAUSTINO GONZÁLEZ',
  'FRANCISCO RODRÍGUEZ',
  'JUAN MANUEL PÉREZ',
  'LORETO CARRETERO',
  'ALEJANDRO ÁVILA',
  'ALBERTO AUGUSTO',
];

const STORAGE_KEY = 'donca_personal_servicio';

export function usePersonal() {
  const [personal, setPersonal] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPersonal(JSON.parse(saved));
      } catch {
        setPersonal(DEFAULT_PERSONAL);
      }
    } else {
      setPersonal(DEFAULT_PERSONAL);
    }
  }, []);

  const addPersonal = (nombre: string) => {
    const trimmed = nombre.trim().toUpperCase();
    if (trimmed && !personal.includes(trimmed)) {
      const updated = [...personal, trimmed];
      setPersonal(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const removePersonal = (nombre: string) => {
    const updated = personal.filter((p) => p !== nombre);
    setPersonal(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { personal, addPersonal, removePersonal };
}
