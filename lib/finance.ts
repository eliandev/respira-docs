// El corazón de Respira: todas las fórmulas de proyección (PRD §8).
// Determinista, puro, sin efectos secundarios. Corre 100% en el navegador.
//
// Nota de honestidad: el interés total usa la aproximación del PRD (cuota*meses - saldo),
// redondeando los meses hacia arriba. Sobreestima como mucho ~1 pago en el último mes
// (dirección conservadora: nunca subestima el costo de tu deuda actual).

import type {
  Deuda,
  DeudaCalculada,
  Baseline,
  Escenario,
  Alerta,
  DiagnosticoResumen,
} from "./types";

const sum = (xs: number[]): number => xs.reduce((a, b) => a + b, 0);

export function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

/** Tasa mensual a partir del APR anual en porcentaje. r = APR/12/100. */
export function tasaMensual(apr: number): number {
  return apr / 12 / 100;
}

/**
 * Meses hasta terminar de pagar una deuda con cuota fija.
 * Devuelve Infinity si la cuota no cubre el interés mensual (nunca se paga).
 */
export function mesesAPago(saldo: number, cuota: number, apr: number): number {
  if (saldo <= 0) return 0;
  if (cuota <= 0) return Infinity;
  const r = tasaMensual(apr);
  if (r <= 0) return Math.ceil(saldo / cuota); // sin interés
  const interesMensual = saldo * r;
  if (cuota <= interesMensual) return Infinity; // los intereses se comen el pago
  const n = -Math.log(1 - interesMensual / cuota) / Math.log(1 + r);
  return Math.ceil(n);
}

/** Interés total estimado ≈ cuota*meses - saldo. Infinity si la deuda nunca se paga. */
export function interesTotal(saldo: number, cuota: number, meses: number): number {
  if (!Number.isFinite(meses)) return Infinity;
  return Math.max(0, cuota * meses - saldo);
}

/** Tasa promedio ponderada por saldo, en %. Σ(Bi*APRi) / Σ Bi. */
export function tasaPromedioPonderada(deudas: Deuda[]): number {
  const total = sum(deudas.map((d) => d.saldo));
  if (total <= 0) return 0;
  return sum(deudas.map((d) => d.saldo * d.tasa)) / total;
}

/** Situación agregada "a como vas hoy" (PRD §8). */
export function baseline(deudas: Deuda[]): Baseline {
  const calculadas: DeudaCalculada[] = deudas.map((d) => {
    const meses = mesesAPago(d.saldo, d.cuota, d.tasa);
    return {
      ...d,
      meses,
      interes: interesTotal(d.saldo, d.cuota, meses),
      nuncaSePaga: !Number.isFinite(meses),
    };
  });

  const deudaTotal = sum(calculadas.map((d) => d.saldo));
  const cuotaActual = sum(calculadas.map((d) => d.cuota));
  const hayDeudaImpagable = calculadas.some((d) => d.nuncaSePaga);

  // Si alguna deuda nunca se paga, no hay fecha de salida ni interés finito (PRD §8: max(ni)).
  const mesesActual = hayDeudaImpagable
    ? Infinity
    : Math.max(0, ...calculadas.map((d) => d.meses));
  const interesActual = hayDeudaImpagable
    ? Infinity
    : sum(calculadas.map((d) => d.interes));

  const alertas: Alerta[] = calculadas
    .filter((d) => d.nuncaSePaga)
    .map((d) => ({ deudaId: d.id, entidad: d.entidad, tipo: "nunca_se_paga" }));

  return {
    deudaTotal,
    cuotaActual,
    mesesActual,
    interesActual,
    tasaPromedioPonderada: tasaPromedioPonderada(deudas),
    hayDeudaImpagable,
    alertas,
    deudas: calculadas,
  };
}

/** Cuota de un préstamo consolidado. Maneja apr==0 (evita división por potencia). */
export function cuotaConsolidada(
  deudaTotal: number,
  apr: number,
  plazoMeses: number,
): number {
  if (deudaTotal <= 0 || plazoMeses <= 0) return 0;
  const r = tasaMensual(apr);
  if (r <= 0) return deudaTotal / plazoMeses;
  return (deudaTotal * r) / (1 - Math.pow(1 + r, -plazoMeses));
}

/** Escenario consolidado según los sliders (tasa, plazo). Clampa entradas a rangos válidos. */
export function escenarioConsolidado(
  base: Baseline,
  apr: number,
  plazoMeses: number,
): Escenario {
  const tasa = clamp(apr, 0, 200);
  const meses = Math.max(1, Math.round(plazoMeses));
  const cuota = cuotaConsolidada(base.deudaTotal, tasa, meses);
  const interes = Math.max(0, cuota * meses - base.deudaTotal);
  const dineroLiberadoMes = base.cuotaActual - cuota;
  const interesAhorrado = base.interesActual - interes; // Infinity si baseline impagable
  return {
    tasa,
    meses,
    cuota,
    interes,
    dineroLiberadoMes,
    interesAhorrado,
    convieneInteres: interesAhorrado >= 0,
  };
}

/**
 * Resumen del diagnóstico para la captura de lead (PRD §10).
 * SOLO agregados: nunca incluye el detalle de cada deuda. Serializable a JSON
 * (Infinity → null en meses, 0 en interés ahorrado).
 */
export function construirResumen(
  base: Baseline,
  esc: Escenario,
  cantidadDeudas: number,
): DiagnosticoResumen {
  const dos = (n: number) => Math.round(n * 100) / 100;
  return {
    deudaTotal: dos(base.deudaTotal),
    cuotaActual: dos(base.cuotaActual),
    cuotaConsolidada: dos(esc.cuota),
    dineroLiberadoMes: dos(esc.dineroLiberadoMes),
    interesAhorrado: Number.isFinite(esc.interesAhorrado)
      ? dos(esc.interesAhorrado)
      : 0,
    mesesActual: Number.isFinite(base.mesesActual)
      ? Math.round(base.mesesActual)
      : null,
    mesesConsolidado: esc.meses,
    hayDeudaImpagable: base.hayDeudaImpagable,
    cantidadDeudas,
  };
}
