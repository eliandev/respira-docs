// Utilidades de UI compartidas: clases Tailwind reutilizadas y un helper para
// componerlas. Centralizar estos estilos evita que se repitan (y se desincronicen)
// entre botones, inputs y tarjetas de los distintos pasos.

/** Une clases ignorando valores vacíos/falsos. */
export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}

/** Botón principal (acción/CTA). El padding se agrega por uso. */
export const btnPrimary =
  "rounded-xl bg-brand-600 font-semibold text-white transition-colors hover:bg-brand-700";

/** Botón secundario/fantasma (ej. "Volver"). */
export const btnGhost =
  "rounded-xl px-4 py-3 font-medium text-muted transition-colors hover:text-ink";

/** Tarjeta base (borde suave + sombra). */
export const card =
  "rounded-2xl border border-line bg-white p-5 shadow-soft";

/** Input de texto/número base. */
export const textInput =
  "w-full rounded-lg border border-line bg-sand-50 px-3 py-2 text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";
