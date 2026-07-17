// Tipos centrales de Respira.
// El detalle de cada deuda vive SOLO en memoria del navegador (privacidad, PRD §11).
// Lo único que puede llegar a persistirse es `DiagnosticoResumen` (Paso 4), nunca el detalle por deuda.

export type Step = "welcome" | "debts" | "result" | "advisor";

/** Orden canónico de los pasos del flujo (navegación y progreso). */
export const STEP_ORDER: Step[] = ["welcome", "debts", "result", "advisor"];

/** Una deuda tal como la ingresa la persona. */
export interface Deuda {
  id: string;
  entidad: string;
  /** Bi — saldo actual pendiente. */
  saldo: number;
  /** Pi — cuota mensual que paga hoy. */
  cuota: number;
  /** APR anual en porcentaje (ej. 45 = 45%). */
  tasa: number;
}

/** Una deuda con su proyección baseline ya calculada (PRD §8). */
export interface DeudaCalculada extends Deuda {
  /** ni — meses hasta terminar de pagar; Infinity si nunca se paga. */
  meses: number;
  /** Interés total estimado (Pi*ni - Bi); Infinity si nunca se paga. */
  interes: number;
  /** true si cuota <= saldo * tasaMensual (los intereses se comen el pago). */
  nuncaSePaga: boolean;
}

export interface Alerta {
  deudaId: string;
  entidad: string;
  tipo: "nunca_se_paga";
}

/** Situación agregada "a como vas hoy". */
export interface Baseline {
  /** Σ Bi */
  deudaTotal: number;
  /** Σ Pi */
  cuotaActual: number;
  /** max(ni); Infinity si alguna deuda nunca se paga. */
  mesesActual: number;
  /** Σ interés de cada deuda; Infinity si alguna nunca se paga. */
  interesActual: number;
  /** Tasa promedio ponderada por saldo, en %. */
  tasaPromedioPonderada: number;
  hayDeudaImpagable: boolean;
  alertas: Alerta[];
  deudas: DeudaCalculada[];
}

/** Escenario consolidado según los sliders (tasa, plazo). */
export interface Escenario {
  /** APR anual % usada en la consolidación. */
  tasa: number;
  /** plazoC — plazo en meses. */
  meses: number;
  /** PC — nueva cuota mensual. */
  cuota: number;
  /** Interés total del plan consolidado (PC*plazoC - deudaTotal). */
  interes: number;
  /** cuotaActual - PC (positivo = recuperás aire cada mes). */
  dineroLiberadoMes: number;
  /** interesActual - interesConsolidado (puede ser negativo). */
  interesAhorrado: number;
  /** interesAhorrado >= 0. */
  convieneInteres: boolean;
}

export interface Resultado {
  baseline: Baseline;
  escenario: Escenario;
}

// ── Captura de lead (Paso 4, opcional) ────────────────────────────
// El resumen NO incluye el detalle por deuda (PRD §10, guardrails).

export interface DiagnosticoResumen {
  deudaTotal: number;
  cuotaActual: number;
  cuotaConsolidada: number;
  dineroLiberadoMes: number;
  interesAhorrado: number;
  /** null si hay deuda impagable (no serializamos Infinity). */
  mesesActual: number | null;
  mesesConsolidado: number;
  hayDeudaImpagable: boolean;
  cantidadDeudas: number;
}

export type ContactoPreferido = "whatsapp" | "telefono" | "email";

export interface LeadInput {
  nombre: string;
  /** Teléfono o email, según contactoPreferido. */
  contacto: string;
  contactoPreferido: ContactoPreferido;
  consentimiento: boolean;
  resumen: DiagnosticoResumen;
}
