"use client";

import { dict } from "@/lib/i18n";
import { useRespira } from "./RespiraApp";
import { useResultado } from "./useResultado";
import { btnGhost, btnPrimary, cn } from "@/lib/ui";
import StepHeader from "./StepHeader";
import ResultCards from "./ResultCards";
import Sliders from "./Sliders";
import InterestGauge from "./InterestGauge";
import HonestyNote from "./HonestyNote";
import Disclaimer from "./Disclaimer";

export default function StepResult() {
  const { state, dispatch } = useRespira();
  const t = dict.result;

  const { base, esc } = useResultado(
    state.deudas,
    state.tasaConsolidada,
    state.plazoConsolidado,
  );

  return (
    <section className="flex flex-col gap-6 py-6">
      <StepHeader title={t.title} subtitle={t.subtitle} />

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
          className={btnGhost}
        >
          {t.volverAEditar}
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "next" })}
          className={cn(btnPrimary, "ml-auto px-6 py-3")}
        >
          {t.continuar}
        </button>
      </div>
    </section>
  );
}
