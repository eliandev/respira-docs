"use client";

import { useMemo } from "react";
import { dict } from "@/lib/i18n";
import { useRespira } from "./RespiraApp";
import { baseline, escenarioConsolidado } from "@/lib/finance";
import ResultCards from "./ResultCards";
import Sliders from "./Sliders";
import InterestGauge from "./InterestGauge";
import HonestyNote from "./HonestyNote";
import Disclaimer from "./Disclaimer";

export default function StepResult() {
  const { state, dispatch } = useRespira();
  const t = dict.result;

  const base = useMemo(() => baseline(state.deudas), [state.deudas]);
  const esc = useMemo(
    () =>
      escenarioConsolidado(base, state.tasaConsolidada, state.plazoConsolidado),
    [base, state.tasaConsolidada, state.plazoConsolidado],
  );

  return (
    <section className="flex flex-col gap-6 py-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">
          {t.title}
        </h1>
        <p className="text-muted">{t.subtitle}</p>
      </header>

      <ResultCards base={base} esc={esc} ingreso={state.ingresoMensual} />

      <Sliders
        tasa={state.tasaConsolidada}
        plazo={state.plazoConsolidado}
        onTasa={(n) => dispatch({ type: "set_tasa", value: n })}
        onPlazo={(n) => dispatch({ type: "set_plazo", value: n })}
      />

      <InterestGauge base={base} esc={esc} />
      <HonestyNote base={base} esc={esc} />
      <Disclaimer />

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => dispatch({ type: "back" })}
          className="rounded-xl px-4 py-3 font-medium text-muted transition-colors hover:text-ink"
        >
          {t.volverAEditar}
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "next" })}
          className="ml-auto rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
        >
          {t.continuar}
        </button>
      </div>
    </section>
  );
}
