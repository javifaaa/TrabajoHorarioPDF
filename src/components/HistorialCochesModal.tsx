import React, { useEffect, useState } from 'react';
import { useCoches } from '../hooks/useCoches';
import { CarFront, Calendar, X, ChevronDown } from 'lucide-react';

interface HistorialCochesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistorialCochesModal: React.FC<HistorialCochesModalProps> = ({ isOpen, onClose }) => {
  const { obtenerHistorialSemanas } = useCoches();
  const [historial, setHistorial] = useState<{ etiqueta: string; total: number; dias: { fecha: string; cantidad: number }[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  const toggleWeek = (index: number) => {
    setExpandedWeek(expandedWeek === index ? null : index);
  };

  useEffect(() => {
    if (isOpen) {
      cargarHistorial();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const cargarHistorial = async () => {
    setLoading(true);
    const data = await obtenerHistorialSemanas();
    setHistorial(data);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md max-h-[80vh] bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-700 animate-slideUp">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 bg-slate-800">
          <div className="flex items-center gap-2">
            <CarFront className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Historial Semanal</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            aria-label="Cerrar historial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-10">
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-400 text-sm">Cargando historial...</p>
             </div>
          ) : historial.length === 0 ? (
             <div className="text-center py-10">
                <p className="text-slate-400">No hay datos registrados aún.</p>
             </div>
          ) : (
            <div className="space-y-3">
              {historial.map((item, i) => (
                <div 
                  key={i} 
                  className="flex flex-col p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors cursor-pointer"
                  onClick={() => toggleWeek(i)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Calendar className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-200">{item.etiqueta}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-bold text-amber-400 text-lg">
                        {item.total} <span className="text-xs font-normal text-slate-400">coches</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedWeek === i ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  
                  {expandedWeek === i && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-2 animate-fadeIn">
                      {item.dias.map((dia, j) => {
                        const dateObj = new Date(dia.fecha);
                        const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(dateObj);
                        const formattedDate = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit' }).format(dateObj);
                        
                        return (
                          <div key={j} className="flex items-center justify-between text-sm px-2 py-1 rounded hover:bg-slate-700/30">
                            <span className="text-slate-400 capitalize">{dayName}, {formattedDate}</span>
                            <span className="text-slate-300 font-medium">{dia.cantidad} coches</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-700 bg-slate-800/50 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-600 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
