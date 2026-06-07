import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const DEFAULT_PERSONAL = [
  'RAFAEL PALLARÉS',
  'FAUSTINO GONZÁLEZ',
  'FRANCISCO RODRÍGUEZ',
  'JUAN MANUEL PÉREZ',
  'LORETO CARRETERO',
  'ALEJANDRO ÁVILA',
  'ALBERTO AUGUSTO',
];

export function usePersonal() {
  const [personal, setPersonal] = useState<string[]>(DEFAULT_PERSONAL);

  useEffect(() => {
    // 1. Fetch initial data
    const fetchPersonal = async () => {
      const { data, error } = await supabase.from('personal').select('nombre').order('created_at');
      if (error || !data) {
        console.error('Error fetching personal:', error);
      } else if (data.length > 0) {
        setPersonal(data.map((row) => row.nombre));
      }
    };
    fetchPersonal();

    // 2. Subscribe to real-time changes
    const channel = supabase
      .channel('personal_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'personal' },
        () => {
          // Re-fetch everything to maintain order, or handle optimistic updates
          fetchPersonal();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addPersonal = async (nombre: string) => {
    const trimmed = nombre.trim().toUpperCase();
    if (trimmed && !personal.includes(trimmed)) {
      // Optimistic update
      setPersonal((prev) => [...prev, trimmed]);
      const { error } = await supabase.from('personal').insert([{ nombre: trimmed }]);
      if (error) {
        console.error('Error inserting personal:', error);
        // We could revert the optimistic update here if needed
      }
    }
  };

  const removePersonal = async (nombre: string) => {
    // Optimistic update
    setPersonal((prev) => prev.filter((p) => p !== nombre));
    const { error } = await supabase.from('personal').delete().eq('nombre', nombre);
    if (error) {
      console.error('Error deleting personal:', error);
    }
  };

  return { personal, addPersonal, removePersonal };
}
