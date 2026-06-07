import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const DEFAULT_RESPONSABLES = [
  'SALVADOR PALMERO',
  'JESÚS LOPEZ',
  'JUAN GONZÁLEZ',
  'JOSÉ BELLIDO',
];

export function useResponsables() {
  const [responsables, setResponsables] = useState<string[]>(DEFAULT_RESPONSABLES);

  useEffect(() => {
    // 1. Fetch initial data
    const fetchResponsables = async () => {
      const { data, error } = await supabase.from('responsables').select('nombre').order('created_at');
      if (error || !data) {
        console.error('Error fetching responsables:', error);
      } else if (data.length > 0) {
        setResponsables(data.map((row) => row.nombre));
      }
    };
    fetchResponsables();

    // 2. Subscribe to real-time changes
    const channel = supabase
      .channel('responsables_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'responsables' },
        () => {
          fetchResponsables();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addResponsable = async (nombre: string) => {
    const trimmed = nombre.trim().toUpperCase();
    if (trimmed && !responsables.includes(trimmed)) {
      setResponsables((prev) => [...prev, trimmed]);
      const { error } = await supabase.from('responsables').insert([{ nombre: trimmed }]);
      if (error) console.error('Error inserting responsable:', error);
    }
  };

  const removeResponsable = async (nombre: string) => {
    setResponsables((prev) => prev.filter((p) => p !== nombre));
    const { error } = await supabase.from('responsables').delete().eq('nombre', nombre);
    if (error) console.error('Error deleting responsable:', error);
  };

  return { responsables, addResponsable, removeResponsable };
}
