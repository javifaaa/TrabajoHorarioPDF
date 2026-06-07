import React from 'react';
import type { UseFormRegister } from 'react-hook-form';
import type { FormularioSchemaType } from '../schemas/incidentForm';

interface IncidentsSectionProps {
  register: UseFormRegister<FormularioSchemaType>;
  incidentCount: number;
  onAddIncident: () => void;
  onRemoveIncident: (index: number) => void;
}

export const IncidentsSection: React.FC<IncidentsSectionProps> = ({
  register,
  incidentCount,
  onAddIncident,
  onRemoveIncident,
}) => {
  return (
    <section className="card" id="seccion-incidencias">
      <div className="card-header">
        <div className="card-icon bg-amber-100 dark:bg-amber-900/50">
          <svg className="w-5 h-5 text-amber-600 dark:text-amber-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <h2 className="card-title">Incidencias</h2>
          <p className="card-subtitle">Registro de eventos del turno</p>
        </div>
      </div>

      {incidentCount === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">No hay incidencias registradas</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs">Pulse el botón para añadir una</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Array.from({ length: incidentCount }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 transition-all duration-200 hover:border-amber-200 dark:hover:border-amber-700/50"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-md">
                  Incidencia {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveIncident(index)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200"
                  aria-label={`Eliminar incidencia ${index + 1}`}
                  id={`remove-incidencia-${index}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-32">
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Hora (opcional)</label>
                  <input
                    type="time"
                    {...register(`incidencias.${index}.hora`)}
                    className="form-input"
                    placeholder="Hora"
                    id={`incidencia-hora-${index}`}
                  />
                </div>

                <div className="flex-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Descripción</label>
                  <textarea
                    {...register(`incidencias.${index}.descripcion`)}
                    className="form-input resize-y"
                    placeholder="Describa la incidencia con todo el detalle necesario..."
                    rows={3}
                    id={`incidencia-descripcion-${index}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onAddIncident}
        className="mt-4 w-full sm:w-auto btn-secondary"
        id="add-incidencia-btn"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Añadir incidencia
      </button>
    </section>
  );
};
