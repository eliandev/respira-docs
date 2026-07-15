// Formateo local (El Salvador usa USD). Nunca devolver "NaN"/"Infinity" crudos a la UI.

const monedaEntera = new Intl.NumberFormat("es-SV", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const monedaDecimal = new Intl.NumberFormat("es-SV", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoneda(n: number, decimales = false): string {
  if (!Number.isFinite(n)) return "—";
  return (decimales ? monedaDecimal : monedaEntera).format(n);
}

export function formatPorcentaje(n: number, decimales = 1): string {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(decimales)}%`;
}

/** Convierte meses a un texto humano: "1 año y 3 meses". Infinity → "sin fecha de salida". */
export function formatMeses(meses: number): string {
  if (!Number.isFinite(meses)) return "sin fecha de salida";
  const m = Math.max(0, Math.round(meses));
  if (m === 0) return "0 meses";
  const anios = Math.floor(m / 12);
  const resto = m % 12;
  const partes: string[] = [];
  if (anios > 0) partes.push(`${anios} ${anios === 1 ? "año" : "años"}`);
  if (resto > 0) partes.push(`${resto} ${resto === 1 ? "mes" : "meses"}`);
  return partes.join(" y ");
}
