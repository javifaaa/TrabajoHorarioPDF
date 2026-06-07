import React, { useState } from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { FormularioSchemaType } from '../schemas/incidentForm';
import { useResponsables } from '../hooks/useResponsables';

interface GeneralDataSectionProps {
  register: UseFormRegister<FormularioSchemaType>;
  errors: FieldErrors<FormularioSchemaType>;
}

export const GeneralDataSection: React.FC<GeneralDataSectionProps> = ({ register, errors }) => {
  const { responsables, addResponsable, removeResponsable } = useResponsables();
  const [isManaging, setIsManaging] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAddName = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      addResponsable(newName);
      setNewName('');
    }
  };

  return (
    <section className="card" id="seccion-datos-generales">
      <div className="card-header flex justify-between items-start">
        <div className="flex gap-4">
          <div className="card-icon bg-primary-100 dark:bg-primary-800/50">
            <svg className="w-5 h-5 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <div>
            <h2 className="card-title">Datos Generales</h2>
            <p className="card-subtitle">Información básica del parte</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsManaging(!isManaging)}
          className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline mt-1"
        >
          {isManaging ? 'Cerrar gestión' : 'Gestionar responsables'}
        </button>
      </div>

      {isManaging && (
        <div className="mb-6 p-4 rounded-xl bg-primary-50/50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/50">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Gestionar Nombres de Responsables
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
              placeholder="Añadir nuevo responsable..."
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
            {responsables.map((nombre) => (
              <span
                key={nombre}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              >
                {nombre}
                <button
                  type="button"
                  onClick={() => removeResponsable(nombre)}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* Fecha */}
        <div className="form-group">
          <label htmlFor="fecha" className="form-label">
            Fecha <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="fecha"
            {...register('fecha')}
            className={`form-input ${errors.fecha ? 'form-input-error' : ''}`}
          />
          {errors.fecha && (
            <p className="form-error" role="alert">{errors.fecha.message}</p>
          )}
        </div>

        {/* Centro de trabajo */}
        <div className="form-group">
          <label htmlFor="centroTrabajo" className="form-label">
            Centro de trabajo
          </label>
          <input
            type="text"
            id="centroTrabajo"
            {...register('centroTrabajo')}
            className={`form-input ${errors.centroTrabajo ? 'form-input-error' : ''}`}
          />
          {errors.centroTrabajo && (
            <p className="form-error" role="alert">{errors.centroTrabajo.message}</p>
          )}
        </div>

        {/* Responsable del turno 1 */}
        <div className="form-group">
          <label htmlFor="responsableTurno" className="form-label">
            Responsable turno 1 <span className="text-red-500">*</span>
          </label>
          <select
            id="responsableTurno"
            {...register('responsableTurno')}
            className={`form-input ${errors.responsableTurno ? 'form-input-error' : ''}`}
          >
            <option value="">Seleccionar responsable</option>
            {responsables.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
          {errors.responsableTurno && (
            <p className="form-error" role="alert">{errors.responsableTurno.message}</p>
          )}
        </div>

        {/* Responsable del turno 2 */}
        <div className="form-group">
          <label htmlFor="responsableTurno2" className="form-label">
            Responsable turno 2
          </label>
          <select
            id="responsableTurno2"
            {...register('responsableTurno2')}
            className="form-input"
          >
            <option value="">Seleccionar responsable</option>
            {responsables.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};
