"use client";

import { useMemo } from "react";
import { dict } from "@/lib/i18n";
import { useRespira } from "./RespiraApp";
import DebtRow from "./DebtRow";
import NumberField from "./NumberField";
import { formatMoneda, formatPorcentaje } from "@/lib/format";
import { baseline } from "@/lib/finance";
import { deudaSchema } from "@/lib/validation";

export default function StepDebts() {
  const { state, dispatch } = useRespira();
  const t = dict.debts;
  const { deudas, ingresoMensual } = state;

  const base = useMemo(() => baseline(deudas), [deudas]);
  const puedeContinuar =
    deudas.length > 0 && deudas.every((d) => deudaSchema.safeParse(d).success);

  return (
    <section className="flex flex-col gap-6 py-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{t.title}</h1>
        <p className="text-muted">{t.subtitle}</p>
      </header>

      {deudas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sand-300 bg-white/60 p-8 text-center">
          <p className="text-muted">{t.empty}</p>
          <button
            type="button"
            onClick={() => dispatch({ type: "add_deuda" })}
            className="mt-4 rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {t.addFirst}
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {deudas.map((d, i) => (
              <DebtRow key={d.id} deuda={d} index={i} />
            ))}
          </div>

          <button
            type="button"
            onClick={() => dispatch({ type: "add_deuda" })}
            className="self-start rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-100"
          >
            + {t.addDebt}
          </button>

          {/* Totales en vivo */}
          <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-ink p-5 text-white sm:grid-cols-3">
            <div>
              <dt className="text-xs text-brand-200">{t.totales.deudaTotal}</dt>
              <dd className="mt-1 text-xl font-semibold">
                {formatMoneda(base.deudaTotal)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-brand-200">{t.totales.cuotaTotal}</dt>
              <dd className="mt-1 text-xl font-semibold">
                {formatMoneda(base.cuotaActual)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-brand-200">{t.totales.tasaProm}</dt>
              <dd className="mt-1 text-xl font-semibold">
                {formatPorcentaje(base.tasaPromedioPonderada)}
              </dd>
            </div>
          </dl>

          {/* Ingreso opcional */}
          <div className="max-w-xs">
            <NumberField
              label={t.ingreso.label}
              prefix="$"
              value={ingresoMensual ?? 0}
              onChange={(n) =>
                dispatch({ type: "set_ingreso", value: n > 0 ? n : null })
              }
              placeholder="0"
            />
            <p className="mt-1 text-xs text-muted">{t.ingreso.ayuda}</p>
          </div>
        </>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => dispatch({ type: "back" })}
          className="rounded-xl px-4 py-3 font-medium text-muted transition-colors hover:text-ink"
        >
          {dict.common.volver}
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "next" })}
          disabled={!puedeContinuar}
          className="ml-auto rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-sand-200 disabled:text-sand-500"
        >
          {t.continuar}
        </button>
      </div>
      <p className="text-center text-xs text-muted">{t.nota}</p>
    </section>
  );
}
