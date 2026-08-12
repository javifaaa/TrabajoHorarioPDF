import React from 'react';
import type { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { FormularioSchemaType } from '../schemas/incidentForm';
import { useCoches } from '../hooks/useCoches';
import { CarFront, Calculator, History } from 'lucide-react';
import { HistorialCochesModal } from './HistorialCochesModal';

interface CochesSectionProps {
  register: UseFormRegister<FormularioSchemaType>;
  watch: UseFormWatch<FormularioSchemaType>;
  setValue: UseFormSetValue<FormularioSchemaType>;
}

export const CochesSection: React.FC<CochesSectionProps> = ({ register, watch, setValue }) => {
  const fecha = watch('fecha');
  const parseLocalDate = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    return new Date(parseInt(parts[0]!), parseInt(parts[1]!) - 1, parseInt(parts[2]!));
  };
  
  const dateObj = parseLocalDate(fecha);
  const isSunday = dateObj ? dateObj.getDay() === 0 : false;
  
  const [showHistorial, setShowHistorial] = React.useState(false);
  const { calcularCochesSemana, isCalculating } = useCoches();

  const handleCalculateWeekly = async () => {
    if (!fecha) return;
    const total = await calcularCochesSemana(fecha);
    if (total !== null) {
      setValue('cochesSemana', total.toString());
    }
  };

  return (
  return (
    <section className="card relative overflow-hidden" id="seccion-coches">
      {/* Decorative background element */}
      <div className="absolute -right-20 -top-20 opacity-5 dark:opacity-10 pointer-events-none">
        <CarFront className="w-64 h-64 text-slate-500 dark:text-white" />
      </div>

      <div className="card-header relative z-10">
        <div className="flex gap-4">
          <div className="card-icon bg-blue-100 dark:bg-blue-900/50">
            <CarFront className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h2 className="card-title">Registro de Vehículos</h2>
            <p className="card-subtitle">Control de afluencia del aparcamiento</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 relative z-10">
        {/* Coches Diarios */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50">
          <label className="form-label">
            Coches de hoy
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              {...register('cochesDiarios')}
              className="form-input"
              placeholder="Ej: 150 (Se guardará al Generar PDF)"
            />
          </div>
        </div>

        {/* Coches Semana (SOLO DOMINGOS) */}
        {isSunday && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-700/50 relative overflow-hidden animate-slideUp">
            <div className="absolute top-0 right-0 bg-amber-200 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2 py-1 rounded-bl-lg tracking-wider">
              DOMINGOS
            </div>
            <label className="form-label text-amber-900 dark:text-amber-100">
              Total acumulado semana
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                {...register('cochesSemana')}
                className="form-input border-amber-200 focus:ring-amber-500 focus:border-amber-500 dark:border-amber-700/50 font-bold"
                placeholder="Pulsa calcular ->"
              />
              <button
                type="button"
                onClick={handleCalculateWeekly}
                disabled={isCalculating}
                className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Calcular total de lunes a domingo"
              >
                {isCalculating ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Calculator className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* History Button */}
      <div className="mt-6 flex justify-end relative z-10">
        <button
          type="button"
          onClick={() => setShowHistorial(true)}
          className="btn-outline"
        >
          <History className="w-4 h-4" />
          <span>Ver historial semanal</span>
        </button>
      </div>

      <HistorialCochesModal
        isOpen={showHistorial}
        onClose={() => setShowHistorial(false)}
      />
    </section>
  );
};
