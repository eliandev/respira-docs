"use client";

import { useMemo } from "react";
import type { Deuda, Baseline, Escenario } from "@/lib/types";
import { baseline, escenarioConsolidado } from "@/lib/finance";

// Deriva baseline + escenario consolidado (memoizados) a partir del estado.
// Centraliza el cálculo que compartían StepResult y StepAdvisor.
export function useResultado(
  deudas: Deuda[],
  tasa: number,
  plazo: number,
): { base: Baseline; esc: Escenario } {
  const base = useMemo(() => baseline(deudas), [deudas]);
  const esc = useMemo(
    () => escenarioConsolidado(base, tasa, plazo),
    [base, tasa, plazo],
  );
  return { base, esc };
}
