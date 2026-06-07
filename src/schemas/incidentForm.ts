import { z } from 'zod';

export const auxiliarSchema = z.object({
  nombre: z.string().optional(),
  turno: z.string().optional(),
});

export const incidenciaSchema = z.object({
  hora: z.string().optional(),
  descripcion: z.string().optional(),
});

export const formularioSchema = z.object({
  fecha: z
    .string()
    .min(1, 'La fecha es obligatoria'),
  responsableTurno: z
    .string()
    .min(1, 'El responsable del turno 1 es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  responsableTurno2: z
    .string()
    .optional(),
  centroTrabajo: z
    .string()
    .min(1, 'El centro de trabajo es obligatorio'),
  auxiliares: z.array(auxiliarSchema),
  incidencias: z.array(incidenciaSchema),
});

export type FormularioSchemaType = z.infer<typeof formularioSchema>;
