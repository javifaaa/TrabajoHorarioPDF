import React from 'react';
import type { UseFormRegister, UseFormWatch } from 'react-hook-form';
import type { FormularioSchemaType } from '../schemas/incidentForm';

interface CochesSectionProps {
  register: UseFormRegister<FormularioSchemaType>;
  watch: UseFormWatch<FormularioSchemaType>;
}

export const CochesSection: React.FC<CochesSectionProps> = ({ register, watch }) => {
  const fecha = watch('fecha');
  // En JavaScript, el Domingo es el día 0
  const isSunday = fecha ? new Date(fecha).getDay() === 0 : false;

  return (
    <section className="card" id="seccion-coches">
      <div className="card-header flex gap-4">
        <div className="card-icon bg-indigo-100 dark:bg-indigo-900/50">
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
        </div>
        <div>
          <h2 className="card-title">Registro de Coches</h2>
          <p className="card-subtitle">Afluencia de vehículos</p>
        </div>
      </div>

      <div className="card-body p-4 sm:p-6 grid gap-6 sm:grid-cols-2">
        {/* Coches Diarios */}
        <div className="space-y-1.5 sm:space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            Total coches diarios
          </label>
          <input
            type="number"
            {...register('cochesDiarios')}
            className="input-field"
            placeholder="Ej: 150"
          />
        </div>

        {/* Coches Semana */}
        <div className={`space-y-1.5 sm:space-y-2 transition-opacity duration-300 ${!isSunday ? 'opacity-60' : ''}`}>
          <div className="flex justify-between items-end">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              Total coches semana
            </label>
            {!isSunday && (
              <span className="text-[10px] sm:text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                Solo domingos
              </span>
            )}
          </div>
          <input
            type="number"
            {...register('cochesSemana')}
            className={`input-field ${!isSunday ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-400' : ''}`}
            placeholder={isSunday ? "Ej: 1050" : "Bloqueado"}
            disabled={!isSunday}
          />
        </div>
      </div>
    </section>
  );
};
