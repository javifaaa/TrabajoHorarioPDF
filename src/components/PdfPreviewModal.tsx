import React, { useEffect, useState, useCallback } from 'react';
import type { FormularioData } from '../types';
import { generarPDF, getPDFFileName } from '../utils/pdfGenerator';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FormularioData;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePreview = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const doc = await generarPDF(data);
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      setError('Error al generar la vista previa del PDF');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, [data]);

  useEffect(() => {
    if (isOpen) {
      generatePreview();
    }
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
    };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDownload = useCallback(async () => {
    try {
      const doc = await generarPDF(data);
      doc.save(getPDFFileName(data.fecha));
    } catch (err) {
      console.error('Error descargando PDF:', err);
    }
  }, [data]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      id="pdf-preview-modal"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-modal overflow-hidden flex flex-col animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Vista previa del PDF
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getPDFFileName(data.fecha)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            aria-label="Cerrar vista previa"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5 bg-gray-100 dark:bg-gray-800">
          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">Generando vista previa...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {pdfUrl && !isGenerating && (
            <iframe
              src={pdfUrl}
              className="w-full h-full min-h-[60vh] rounded-lg border border-gray-200 dark:border-gray-600 bg-white"
              title="Vista previa PDF"
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={onClose}
            className="btn-outline"
            id="pdf-cancel-btn"
          >
            Cancelar
          </button>
          <button
            onClick={handleDownload}
            className="btn-primary"
            id="pdf-download-btn"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
};
