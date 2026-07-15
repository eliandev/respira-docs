"use client";

import type { Baseline, Escenario } from "@/lib/types";
import { dict } from "@/lib/i18n";
import { formatMoneda } from "@/lib/format";

// Marco de honestidad (PRD §9): nunca esconder que consolidar puede costar más interés,
// y resaltar con empatía las deudas que "nunca se pagan". Ámbar, nunca rojo de alarma.
export default function HonestyNote({
  base,
  esc,
}: {
  base: Baseline;
  esc: Escenario;
}) {
  const h = dict.honesty;

  // Caso 1: hay deuda que a la cuota actual no se termina de pagar.
  if (base.hayDeudaImpagable) {
    return (
      <div
        role="note"
        className="rounded-2xl border border-attention-200 bg-attention-50 p-5"
      >
        <p className="font-semibold text-attention-700">{h.tituloAviso}</p>
        <p className="mt-1 text-sm text-ink">{h.sinFechaHoy}</p>
        <ul className="mt-3 flex flex-col gap-2">
          {base.alertas.map((a) => (
            <li key={a.deudaId} className="text-sm text-ink">
              • {h.nuncaSePaga(a.entidad)}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Caso 2: consolidar baja la cuota pero cuesta más interés en total.
  if (!esc.convieneInteres) {
    const extra =
      Number.isFinite(esc.interesAhorrado) && esc.interesAhorrado < 0
        ? ` (${formatMoneda(-esc.interesAhorrado)} más en total)`
        : "";
    return (
      <div
        role="note"
        className="rounded-2xl border border-attention-200 bg-attention-50 p-5"
      >
        <p className="font-semibold text-attention-700">{h.tituloAviso}</p>
        <p className="mt-1 text-sm text-ink">
          {h.peorInteres}
          {extra}
        </p>
      </div>
    );
  }

  // Caso 3: consolidar conviene (baja cuota y ahorra interés).
  return (
    <div
      role="note"
      className="rounded-2xl border border-brand-200 bg-brand-50 p-5"
    >
      <p className="text-sm text-brand-800">
        {h.mejorInteres}
        {Number.isFinite(esc.interesAhorrado) && esc.interesAhorrado > 0
          ? ` ${dict.result.labels.interesAhorrado}: ${formatMoneda(esc.interesAhorrado)}.`
          : ""}
      </p>
    </div>
  );
}
