import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { FormularioSchemaType } from '../schemas/incidentForm';

const RESPONSABLES = [
  'SALVADOR PALMERO',
  'JESÚS LOPEZ',
  'JUAN GONZÁLEZ',
  'JOSÉ BELLIDO',
] as const;

interface GeneralDataSectionProps {
  register: UseFormRegister<FormularioSchemaType>;
  errors: FieldErrors<FormularioSchemaType>;
}

export const GeneralDataSection: React.FC<GeneralDataSectionProps> = ({ register, errors }) => {
  return (
    <section className="card" id="seccion-datos-generales">
      <div className="card-header">
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
            {RESPONSABLES.map((nombre) => (
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
            {RESPONSABLES.map((nombre) => (
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
