"use client";

import type { Deuda } from "@/lib/types";
import { dict } from "@/lib/i18n";
import { useRespira } from "./RespiraApp";
import NumberField from "./NumberField";

export default function DebtRow({
  deuda,
  index,
}: {
  deuda: Deuda;
  index: number;
}) {
  const { dispatch } = useRespira();
  const c = dict.debts.campos;
  const upd = (patch: Partial<Deuda>) =>
    dispatch({ type: "update_deuda", id: deuda.id, patch });

  return (
    <fieldset className="rounded-2xl border border-line bg-white p-4 shadow-soft">
      <legend className="px-1 text-sm font-medium text-muted">
        Deuda {index + 1}
      </legend>
      <div className="flex flex-col gap-3">
        <div className="flex items-end gap-2">
          <label className="block flex-1 text-sm">
            <span className="mb-1 block font-medium text-ink">{c.entidad}</span>
            <input
              value={deuda.entidad}
              onChange={(e) => upd({ entidad: e.target.value })}
              placeholder={c.entidadPlaceholder}
              className="w-full rounded-lg border border-line bg-sand-50 px-3 py-2 text-ink outline-none placeholder:text-sand-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </label>
          <button
            type="button"
            onClick={() => dispatch({ type: "remove_deuda", id: deuda.id })}
            className="mb-0.5 shrink-0 rounded-lg border border-line px-3 py-2 text-sm text-muted transition-colors hover:border-attention-200 hover:bg-attention-50 hover:text-attention-700"
            aria-label={`${dict.debts.quitar} deuda ${index + 1}`}
          >
            {dict.debts.quitar}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <NumberField
            label={c.saldo}
            prefix="$"
            value={deuda.saldo}
            onChange={(n) => upd({ saldo: n })}
            placeholder="0"
          />
          <NumberField
            label={c.cuota}
            prefix="$"
            value={deuda.cuota}
            onChange={(n) => upd({ cuota: n })}
            placeholder="0"
          />
          <NumberField
            label={c.tasa}
            suffix="%"
            value={deuda.tasa}
            onChange={(n) => upd({ tasa: n })}
            placeholder="0"
          />
        </div>
      </div>
    </fieldset>
  );
}
