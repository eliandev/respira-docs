"use client";

import type { Baseline, Escenario } from "@/lib/types";
import { dict } from "@/lib/i18n";
import { formatMoneda, formatMeses, formatPorcentaje } from "@/lib/format";

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd
        className={
          strong
            ? "text-lg font-semibold text-brand-800"
            : "text-lg font-semibold text-ink"
        }
      >
        {value}
      </dd>
    </div>
  );
}

export default function ResultCards({
  base,
  esc,
  ingreso,
}: {
  base: Baseline;
  esc: Escenario;
  ingreso: number | null;
}) {
  const t = dict.result;
  const libera = esc.dineroLiberadoMes;
  const alivioPct =
    ingreso && ingreso > 0 && libera > 0 ? (libera / ingreso) * 100 : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Framing emocional y honesto */}
      <div className="rounded-2xl bg-brand-600 p-5 text-white">
        <p className="text-2xl font-semibold leading-tight">
          {t.framing.cuota(
            formatMoneda(base.cuotaActual),
            formatMoneda(esc.cuota),
          )}
        </p>
        <p className="mt-2 text-brand-50">
          {t.framing.libre(formatMeses(esc.meses))}
          {libera > 0 ? ` · ${t.framing.recuperas(formatMoneda(libera))}` : ""}
          {libera < 0 ? ` · ${t.framing.subeCuota(formatMoneda(-libera))}` : ""}
        </p>
        {alivioPct !== null ? (
          <p className="mt-3 inline-block rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
            {formatPorcentaje(alivioPct)} {t.labels.alivio}
          </p>
        ) : null}
      </div>

      {/* Comparación lado a lado */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
            {t.baselineTitle}
          </h3>
          <dl className="mt-3 flex flex-col gap-3">
            <Row
              label={t.labels.cuotaMensual}
              value={formatMoneda(base.cuotaActual)}
            />
            <Row
              label={t.labels.tiempo}
              value={formatMeses(base.mesesActual)}
            />
            <Row
              label={t.labels.interesTotal}
              value={
                base.hayDeudaImpagable ? "—" : formatMoneda(base.interesActual)
              }
            />
          </dl>
        </div>
        <div className="rounded-2xl border-2 border-brand-300 bg-brand-50 p-5 shadow-soft">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            {t.consolidatedTitle}
          </h3>
          <dl className="mt-3 flex flex-col gap-3">
            <Row
              label={t.labels.cuotaMensual}
              value={formatMoneda(esc.cuota)}
              strong
            />
            <Row label={t.labels.tiempo} value={formatMeses(esc.meses)} strong />
            <Row
              label={t.labels.interesTotal}
              value={formatMoneda(esc.interes)}
              strong
            />
          </dl>
        </div>
      </div>
    </div>
  );
}
