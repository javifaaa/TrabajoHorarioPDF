import { useState, useEffect, useCallback, useRef } from 'react';
import type { FormularioData } from '../types';
import { guardarBorrador } from '../utils/storage';

export function useAutoSave(data: Partial<FormularioData>, delayMs = 1000): boolean {
  const [guardado, setGuardado] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const guardar = useCallback(() => {
    guardarBorrador(data);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  }, [data]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(guardar, delayMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [guardar, delayMs]);

  return guardado;
}
