import React, { useState } from 'react';
import type { UseFormRegister, UseFormWatch } from 'react-hook-form';
import type { FormularioSchemaType } from '../schemas/incidentForm';
import { usePersonal } from '../hooks/usePersonal';

const TURNOS = [
  '10-19h',
  '13-20h',
  '19-4h',
  '20-4h',
  '19-5h',
  '20-5h',
  '13-19h / 19:30-2h',
] as const;

interface StaffSectionProps {
  register: UseFormRegister<FormularioSchemaType>;
  watch: UseFormWatch<FormularioSchemaType>;
  auxiliarCount: number;
  onAddAuxiliar: () => void;
  onRemoveAuxiliar: (index: number) => void;
}

export const StaffSection: React.FC<StaffSectionProps> = ({
  register,
  watch,
  auxiliarCount,
  onAddAuxiliar,
  onRemoveAuxiliar,
}) => {
  const auxiliares = watch('auxiliares');
  const { personal, addPersonal, removePersonal } = usePersonal();
  const [isManaging, setIsManaging] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAddName = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      addPersonal(newName);
      setNewName('');
    }
  };

  return (
    <section className="card" id="seccion-personal">
      <div className="card-header flex justify-between items-start">
        <div className="flex gap-4">
          <div className="card-icon bg-blue-100 dark:bg-blue-900/50">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <div>
            <h2 className="card-title">Personal de Servicio</h2>
            <p className="card-subtitle">Hasta 6 auxiliares por turno</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsManaging(!isManaging)}
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline mt-1"
        >
          {isManaging ? 'Cerrar gestión' : 'Gestionar lista'}
        </button>
      </div>

      {isManaging && (
        <div className="mb-6 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Gestionar Nombres de Personal
          </h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddName(e as any);
                }
              }}
              placeholder="Añadir nuevo nombre..."
              className="form-input text-sm py-1.5"
            />
            <button
              type="button"
              onClick={handleAddName}
              className="btn-secondary py-1.5 px-3 text-sm whitespace-nowrap"
            >
              Añadir
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {personal.map((nombre) => (
              <span
                key={nombre}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              >
                {nombre}
                <button
                  type="button"
                  onClick={() => removePersonal(nombre)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {Array.from({ length: auxiliarCount }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-3 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 transition-all duration-200 hover:border-primary-200 dark:hover:border-primary-700"
          >
            <div className="flex items-center gap-2 sm:hidden">
              <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-2 py-0.5 rounded-md">
                Auxiliar {index + 1}
              </span>
            </div>
            
            {/* Number badge - desktop */}
            <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-800/50 text-primary-700 dark:text-primary-300 text-sm font-bold flex-shrink-0 self-center">
              {index + 1}
            </div>

            <div className="flex-1">
              <select
                {...register(`auxiliares.${index}.nombre`)}
                className="form-input"
                id={`auxiliar-nombre-${index}`}
              >
                <option value="">Seleccionar auxiliar</option>
                {personal.map((nombre) => (
                  <option key={nombre} value={nombre}>
                    {nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-40">
              <select
                {...register(`auxiliares.${index}.turno`)}
                className="form-input"
                id={`auxiliar-turno-${index}`}
              >
                <option value="">Turno</option>
                {TURNOS.map((turno) => (
                  <option key={turno} value={turno}>
                    {turno}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => onRemoveAuxiliar(index)}
              className="self-center p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200"
              aria-label={`Eliminar auxiliar ${index + 1}`}
              id={`remove-auxiliar-${index}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {auxiliarCount < 6 && (
        <button
          type="button"
          onClick={onAddAuxiliar}
          className="mt-4 w-full sm:w-auto btn-secondary"
          id="add-auxiliar-btn"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
          </svg>
          Añadir auxiliar
        </button>
      )}

      {/* Summary */}
      {auxiliarCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {auxiliares?.filter(a => a?.nombre?.trim()).length || 0} auxiliar(es) registrado(s) de {auxiliarCount} asignado(s)
          </p>
        </div>
      )}
    </section>
  );
};

