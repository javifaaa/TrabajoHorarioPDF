import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header } from './components/Header';
import { GeneralDataSection } from './components/GeneralDataSection';
import { StaffSection } from './components/StaffSection';
import { IncidentsSection } from './components/IncidentsSection';
import { CochesSection } from './components/CochesSection';
import { PdfPreviewModal } from './components/PdfPreviewModal';
import { ImportExportButtons } from './components/ImportExportButtons';
import { Login } from './components/Login';
import { formularioSchema, type FormularioSchemaType } from './schemas/incidentForm';
import { useAutoSave } from './hooks/useAutoSave';
import { useDarkMode } from './hooks/useDarkMode';
import { cargarBorrador, limpiarBorrador } from './utils/storage';
import type { FormularioData } from './types';

const getLocalDateString = (): string => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split('T')[0] ?? '';
};

const DEFAULT_VALUES: FormularioSchemaType = {
  fecha: getLocalDateString(),
  responsableTurno: '',
  responsableTurno2: '',
  centroTrabajo: 'Holtenia S.A (Bingo América)',
  auxiliares: [{ nombre: '', turno: '' }],
  incidencias: [],
  cochesDiarios: '',
  cochesSemana: '',
};

function App() {
  const [mode, toggleMode] = useDarkMode();
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [auxiliarCount, setAuxiliarCount] = useState(1);
  const [incidentCount, setIncidentCount] = useState(0);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // --- LOGIN ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('donca_auth') === 'true';
  });

  const handleLoginSuccess = () => {
    sessionStorage.setItem('donca_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('donca_auth');
    setIsAuthenticated(false);
  };

  // Load saved draft
  const savedData = useMemo(() => cargarBorrador(), []);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormularioSchemaType>({
    resolver: zodResolver(formularioSchema),
    defaultValues: savedData
      ? {
          fecha: savedData.fecha ?? DEFAULT_VALUES.fecha,
          responsableTurno: savedData.responsableTurno ?? DEFAULT_VALUES.responsableTurno,
          responsableTurno2: savedData.responsableTurno2 ?? DEFAULT_VALUES.responsableTurno2,
          centroTrabajo: savedData.centroTrabajo ?? DEFAULT_VALUES.centroTrabajo,
          auxiliares: savedData.auxiliares?.length ? savedData.auxiliares : DEFAULT_VALUES.auxiliares,
          incidencias: savedData.incidencias ?? DEFAULT_VALUES.incidencias,
          cochesDiarios: savedData.cochesDiarios ?? DEFAULT_VALUES.cochesDiarios,
          cochesSemana: savedData.cochesSemana ?? DEFAULT_VALUES.cochesSemana,
        }
      : DEFAULT_VALUES,
  });

  // Restore counts from draft
  useEffect(() => {
    if (savedData) {
      if (savedData.auxiliares?.length) {
        setAuxiliarCount(savedData.auxiliares.length);
      }
      if (savedData.incidencias?.length) {
        setIncidentCount(savedData.incidencias.length);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Watch form for auto-save
  const watchedValues = watch();
  const autoSaveData = useMemo<Partial<FormularioData>>(
    () => ({
      ...watchedValues,
    }),
    [watchedValues]
  );
  const guardado = useAutoSave(autoSaveData);

  // Show notifications
  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // --- AUXILIAR HANDLERS ---
  const handleAddAuxiliar = useCallback(() => {
    if (auxiliarCount < 6) {
      setValue(`auxiliares.${auxiliarCount}`, { nombre: '', turno: '' });
      setAuxiliarCount((prev) => prev + 1);
    }
  }, [auxiliarCount, setValue]);

  const handleRemoveAuxiliar = useCallback(
    (index: number) => {
      const current = watch('auxiliares');
      const updated = current.filter((_, i) => i !== index);
      if (updated.length === 0) {
        updated.push({ nombre: '', turno: '' });
      }
      reset(
        { ...watchedValues, auxiliares: updated },
        { keepDirty: true, keepErrors: true }
      );
      setAuxiliarCount(updated.length);
    },
    [watch, watchedValues, reset]
  );

  // --- INCIDENT HANDLERS ---
  const handleAddIncident = useCallback(() => {
    setValue(`incidencias.${incidentCount}`, { hora: '', descripcion: '' });
    setIncidentCount((prev) => prev + 1);
  }, [incidentCount, setValue]);

  const handleRemoveIncident = useCallback(
    (index: number) => {
      const current = watch('incidencias');
      const updated = current.filter((_, i) => i !== index);
      reset(
        { ...watchedValues, incidencias: updated },
        { keepDirty: true, keepErrors: true }
      );
      setIncidentCount(updated.length);
    },
    [watch, watchedValues, reset]
  );

  // --- PDF ---
  const handleGeneratePdf = useCallback(
    (data: FormularioSchemaType) => {
      void data;
      setShowPdfPreview(true);
    },
    []
  );

  const getFullFormData = useCallback((): FormularioData => {
    const values = watch();
    return {
      fecha: values.fecha,
      responsableTurno: values.responsableTurno,
      responsableTurno2: values.responsableTurno2,
      centroTrabajo: values.centroTrabajo,
      auxiliares: values.auxiliares,
      incidencias: values.incidencias,
      cochesDiarios: values.cochesDiarios,
      cochesSemana: values.cochesSemana,
    };
  }, [watch]);

  // --- EXPORT JSON ---
  const handleExportJSON = useCallback(() => {
    try {
      const data = getFullFormData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Parte_Incidencias_${data.fecha || 'borrador'}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('success', 'Copia guardada correctamente');
    } catch {
      showNotification('error', 'Error al exportar los datos');
    }
  }, [getFullFormData, showNotification]);

  // --- IMPORT JSON ---
  const handleImportJSON = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as FormularioData;
          
          reset({
            fecha: data.fecha ?? DEFAULT_VALUES.fecha,
            responsableTurno: data.responsableTurno ?? '',
            responsableTurno2: data.responsableTurno2 ?? '',
            centroTrabajo: data.centroTrabajo ?? DEFAULT_VALUES.centroTrabajo,
            auxiliares: data.auxiliares?.length ? data.auxiliares : DEFAULT_VALUES.auxiliares,
            incidencias: data.incidencias ?? [],
            cochesDiarios: data.cochesDiarios ?? '',
            cochesSemana: data.cochesSemana ?? '',
          });

          setAuxiliarCount(data.auxiliares?.length || 1);
          setIncidentCount(data.incidencias?.length || 0);

          showNotification('success', 'Parte importado correctamente');
        } catch {
          showNotification('error', 'Error al importar: archivo JSON inválido');
        }
      };
      reader.readAsText(file);

      event.target.value = '';
    },
    [reset, showNotification]
  );

  // --- NEW FORM ---
  const handleNewForm = useCallback(() => {
    if (window.confirm('¿Desea crear un nuevo parte? Se perderán los datos no guardados.')) {
      reset(DEFAULT_VALUES);
      setAuxiliarCount(1);
      setIncidentCount(0);
      limpiarBorrador();
      showNotification('success', 'Nuevo parte creado');
    }
  }, [reset, showNotification]);

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header mode={mode} onToggleMode={toggleMode} guardado={guardado} onLogout={handleLogout} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-5 sm:space-y-6">
        {/* Notification toast */}
        {notification && (
          <div
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-slideUp ${
              notification.type === 'success'
                ? 'bg-accent-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
            {notification.message}
          </div>
        )}

        <form onSubmit={handleSubmit(handleGeneratePdf)} className="space-y-5 sm:space-y-6">
          {/* Section 1: General Data */}
          <GeneralDataSection register={register} errors={errors} />

          {/* Section 2: Staff */}
          <StaffSection
            register={register}
            watch={watch}
            auxiliarCount={auxiliarCount}
            onAddAuxiliar={handleAddAuxiliar}
            onRemoveAuxiliar={handleRemoveAuxiliar}
          />

          {/* Section 3: Coches */}
          <CochesSection register={register} watch={watch} />

          {/* Section 4: Incidents */}
          <IncidentsSection
            register={register}
            incidentCount={incidentCount}
            onAddIncident={handleAddIncident}
            onRemoveIncident={handleRemoveIncident}
          />

          {/* Action Buttons */}
          <div className="card">
            <div className="space-y-4">
              {/* Primary action */}
              <button
                type="submit"
                className="btn-success w-full"
                id="generate-pdf-btn"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                Generar PDF
              </button>

              {/* Import/Export */}
              <ImportExportButtons
                onExportJSON={handleExportJSON}
                onImportJSON={handleImportJSON}
              />

              {/* New form */}
              <button
                type="button"
                onClick={handleNewForm}
                className="btn-outline w-full text-gray-500"
                id="new-form-btn"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                Nuevo parte
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="py-4 sm:py-6 text-center border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Parte de Incidencias &mdash; Gestión de Servicios &copy; {new Date().getFullYear()}
        </p>
      </footer>

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        data={getFullFormData()}
      />
    </div>
  );
}

export default App;
