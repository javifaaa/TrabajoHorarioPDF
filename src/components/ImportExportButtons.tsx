import React from 'react';

interface ImportExportButtonsProps {
  onExportJSON: () => void;
  onImportJSON: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImportExportButtons: React.FC<ImportExportButtonsProps> = ({
  onExportJSON,
  onImportJSON,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col sm:flex-row gap-3" id="import-export-section">
      <button
        type="button"
        onClick={onExportJSON}
        className="btn-outline flex-1"
        id="export-json-btn"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Guardar copia (JSON)
      </button>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="btn-outline flex-1"
        id="import-json-btn"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        Importar parte (JSON)
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={onImportJSON}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
};
