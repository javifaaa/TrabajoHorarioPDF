import { useState } from 'react';
import { supabase } from '../utils/supabase';

export function useCoches() {
  const [isSaving, setIsSaving] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const guardarCochesDiarios = async (fecha: string, cantidad: number) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('registro_coches')
        .upsert({ fecha, cantidad });
      
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error guardando coches:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const calcularCochesSemana = async (fechaDomingo: string) => {
    setIsCalculating(true);
    try {
      const [y, m, d] = fechaDomingo.split('-');
      const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      const day = date.getDay();
      
      // Asegurarnos de que calculamos desde el lunes de esta semana
      const diffToMonday = day === 0 ? -6 : 1 - day; 
      const monday = new Date(date);
      monday.setDate(date.getDate() + diffToMonday);
      
      const formatLocalDate = (d: Date) => {
        const yy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yy}-${mm}-${dd}`;
      };
      
      const mondayStr = formatLocalDate(monday);

      const { data, error } = await supabase
        .from('registro_coches')
        .select('cantidad')
        .gte('fecha', mondayStr)
        .lte('fecha', fechaDomingo);

      if (error) throw error;

      if (!data || data.length === 0) return 0;
      
      const total = data.reduce((sum, row) => sum + (row.cantidad || 0), 0);
      return total;
    } catch (err) {
      console.error('Error calculando coches semanales:', err);
      return null;
    } finally {
      setIsCalculating(false);
    }
  };

  return {
    guardarCochesDiarios,
    calcularCochesSemana,
    isSaving,
    isCalculating
  };
}
