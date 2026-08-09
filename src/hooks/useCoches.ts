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
      const parts = fechaDomingo.split('-');
      if (parts.length !== 3) return 0;
      const date = new Date(parseInt(parts[0]!), parseInt(parts[1]!) - 1, parseInt(parts[2]!));
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

  const obtenerHistorialSemanas = async () => {
    try {
      const { data, error } = await supabase
        .from('registro_coches')
        .select('fecha, cantidad')
        .order('fecha', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      // Agrupar por semana
      const weeks = new Map<string, { total: number, startDate: Date, endDate: Date }>();
      
      data.forEach(row => {
        if (!row.fecha || !row.cantidad) return;
        
        const parts = row.fecha.split('-');
        if (parts.length !== 3) return;
        
        const date = new Date(parseInt(parts[0]!), parseInt(parts[1]!) - 1, parseInt(parts[2]!));
        
        const day = date.getDay();
        const diffToMonday = day === 0 ? -6 : 1 - day;
        
        const monday = new Date(date);
        monday.setDate(date.getDate() + diffToMonday);
        
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        const weekKey = `${monday.toISOString().split('T')[0]}_${sunday.toISOString().split('T')[0]}`;
        
        const current = weeks.get(weekKey) || { total: 0, startDate: monday, endDate: sunday };
        weeks.set(weekKey, { ...current, total: current.total + row.cantidad });
      });

      const formatDate = (d: Date) => {
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yy = d.getFullYear();
        return `${dd}/${mm}/${yy}`;
      };

      return Array.from(weeks.values()).map(w => ({
        etiqueta: `Semana del ${formatDate(w.startDate)} al ${formatDate(w.endDate)}`,
        total: w.total,
        startDate: w.startDate
      })).sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

    } catch (err) {
      console.error('Error obteniendo historial:', err);
      return [];
    }
  };

  return {
    guardarCochesDiarios,
    calcularCochesSemana,
    obtenerHistorialSemanas,
    isSaving,
    isCalculating
  };
}
