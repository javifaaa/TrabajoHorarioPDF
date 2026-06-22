import React from 'react';
import type { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { FormularioSchemaType } from '../schemas/incidentForm';
import { useCoches } from '../hooks/useCoches';
import { CarFront, Calculator } from 'lucide-react';

interface CochesSectionProps {
  register: UseFormRegister<FormularioSchemaType>;
  watch: UseFormWatch<FormularioSchemaType>;
  setValue: UseFormSetValue<FormularioSchemaType>;
}

export const CochesSection: React.FC<CochesSectionProps> = ({ register, watch, setValue }) => {
  const fecha = watch('fecha');
  const cochesDiarios = watch('cochesDiarios');
  const parseLocalDate = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    return new Date(parseInt(parts[0]!), parseInt(parts[1]!) - 1, parseInt(parts[2]!));
  };
  
  const dateObj = parseLocalDate(fecha);
  const isSunday = dateObj ? dateObj.getDay() === 0 : false;
  
  const { calcularCochesSemana, isCalculating } = useCoches();

  const handleCalculateWeekly = async () => {
    if (!fecha) return;
    const total = await calcularCochesSemana(fecha);
    if (total !== null) {
      setValue('cochesSemana', total.toString());
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-xl" id="seccion-coches">
      {/* Decorative background element */}
      <div className="absolute -right-20 -top-20 opacity-10 pointer-events-none">
        <CarFront className="w-64 h-64" />
      </div>

      <div className="p-6 relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
            <CarFront className="w-6 h-6 text-blue-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Registro de Vehículos</h2>
            <p className="text-sm text-slate-400">Control de afluencia del aparcamiento</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Coches Diarios */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Coches de hoy
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                {...register('cochesDiarios')}
                className="w-full bg-slate-900/50 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="Ej: 150 (Se guardará al Generar PDF)"
              />
            </div>
          </div>

          {/* Coches Semana (SOLO DOMINGOS) */}
          {isSunday && (
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-amber-500/30 relative overflow-hidden animate-slideUp">
              <div className="absolute top-0 right-0 bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-1 rounded-bl-lg tracking-wider">
                DOMINGOS
              </div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Total acumulado semana
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  {...register('cochesSemana')}
                  className="w-full bg-slate-900/50 border border-amber-500/30 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none font-bold"
                  placeholder="Pulsa calcular ->"
                />
                <button
                  type="button"
                  onClick={handleCalculateWeekly}
                  disabled={isCalculating}
                  className="px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </section>
  );
};
