export interface Auxiliar {
  nombre?: string;
  turno?: string;
}

export interface Incidencia {
  hora?: string;
  descripcion?: string;
}

export interface FormularioData {
  fecha: string;
  responsableTurno: string;
  responsableTurno2?: string;
  centroTrabajo: string;
  auxiliares: Auxiliar[];
  incidencias: Incidencia[];
}

export type ThemeMode = 'light' | 'dark';
