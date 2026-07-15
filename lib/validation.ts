import { z } from "zod";

// Validación de una deuda. Se usa para habilitar el paso de resultado
// (todas las deudas deben tener saldo y cuota válidos).
export const deudaSchema = z.object({
  id: z.string(),
  entidad: z.string().trim().min(1),
  saldo: z.number().positive(),
  cuota: z.number().positive(),
  tasa: z.number().min(0).max(200),
});

export type DeudaValida = z.infer<typeof deudaSchema>;

// Resumen del diagnóstico: solo agregados, nunca el detalle por deuda (PRD §10).
export const resumenSchema = z.object({
  deudaTotal: z.number(),
  cuotaActual: z.number(),
  cuotaConsolidada: z.number(),
  dineroLiberadoMes: z.number(),
  interesAhorrado: z.number(),
  mesesActual: z.number().nullable(),
  mesesConsolidado: z.number(),
  hayDeudaImpagable: z.boolean(),
  cantidadDeudas: z.number().int().nonnegative(),
});

const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Lead: nombre, contacto, medio preferido, consentimiento EXPLÍCITO y el resumen.
export const leadSchema = z
  .object({
    nombre: z.string().trim().min(1).max(80),
    contacto: z.string().trim().min(3).max(120),
    contactoPreferido: z.enum(["whatsapp", "telefono", "email"]),
    consentimiento: z.literal(true),
    resumen: resumenSchema,
  })
  .superRefine((val, ctx) => {
    if (val.contactoPreferido === "email" && !emailRegex.test(val.contacto)) {
      ctx.addIssue({
        code: "custom",
        path: ["contacto"],
        message: "email_invalido",
      });
    }
  });

export type LeadValidado = z.infer<typeof leadSchema>;
