import { describe, it, expect } from "vitest";
import {
  mesesAPago,
  interesTotal,
  tasaPromedioPonderada,
  baseline,
  cuotaConsolidada,
  escenarioConsolidado,
  clamp,
} from "./finance";
import type { Deuda } from "./types";

const deuda = (over: Partial<Deuda>): Deuda => ({
  id: "x",
  entidad: "Test",
  saldo: 1000,
  cuota: 100,
  tasa: 0,
  ...over,
});

describe("mesesAPago", () => {
  it("sin interés: 1000 con cuota 100 → 10 meses (caso de sanidad del PRD)", () => {
    expect(mesesAPago(1000, 100, 0)).toBe(10);
  });

  it("con interés positivo redondea hacia arriba", () => {
    // r=1%/mes, saldo 1000, cuota 100 → n≈10.59 → 11
    expect(mesesAPago(1000, 100, 12)).toBe(11);
  });

  it("cuota que no cubre el interés → nunca se paga (Infinity)", () => {
    // r=5%/mes → interés mensual 50; cuota 40 < 50
    expect(mesesAPago(1000, 40, 60)).toBe(Infinity);
  });

  it("cuota exactamente igual al interés → nunca se paga", () => {
    expect(mesesAPago(1000, 50, 60)).toBe(Infinity);
  });

  it("saldo 0 → 0 meses", () => {
    expect(mesesAPago(0, 100, 20)).toBe(0);
  });
});

describe("interesTotal", () => {
  it("sin interés (10 meses de 100 sobre 1000) → 0", () => {
    expect(interesTotal(1000, 100, 10)).toBe(0);
  });
  it("meses Infinity → interés Infinity", () => {
    expect(interesTotal(1000, 40, Infinity)).toBe(Infinity);
  });
  it("con interés: 11 pagos de 100 sobre 1000 → 100", () => {
    expect(interesTotal(1000, 100, 11)).toBe(100);
  });
});

describe("tasaPromedioPonderada", () => {
  it("pondera por saldo", () => {
    const ds = [deuda({ saldo: 1000, tasa: 40 }), deuda({ saldo: 3000, tasa: 20 })];
    expect(tasaPromedioPonderada(ds)).toBe(25);
  });
  it("sin deudas → 0", () => {
    expect(tasaPromedioPonderada([])).toBe(0);
  });
});

describe("baseline", () => {
  it("agrega totales de varias deudas", () => {
    const b = baseline([
      deuda({ id: "a", saldo: 1000, cuota: 100, tasa: 0 }),
      deuda({ id: "b", saldo: 2000, cuota: 250, tasa: 0 }),
    ]);
    expect(b.deudaTotal).toBe(3000);
    expect(b.cuotaActual).toBe(350);
    expect(b.hayDeudaImpagable).toBe(false);
    // mesesActual = max(10, 8) = 10
    expect(b.mesesActual).toBe(10);
  });

  it("marca deuda impagable y no inventa fecha de salida", () => {
    const b = baseline([
      deuda({ id: "a", saldo: 1000, cuota: 100, tasa: 0 }),
      deuda({ id: "b", saldo: 1000, cuota: 40, tasa: 60 }), // nunca se paga
    ]);
    expect(b.hayDeudaImpagable).toBe(true);
    expect(b.mesesActual).toBe(Infinity);
    expect(b.interesActual).toBe(Infinity);
    expect(b.alertas).toHaveLength(1);
    expect(b.alertas[0].entidad).toBe("Test");
  });

  it("sin deudas → todo en cero", () => {
    const b = baseline([]);
    expect(b.deudaTotal).toBe(0);
    expect(b.cuotaActual).toBe(0);
    expect(b.mesesActual).toBe(0);
    expect(b.hayDeudaImpagable).toBe(false);
  });
});

describe("cuotaConsolidada", () => {
  it("apr 0 → deudaTotal / plazo", () => {
    expect(cuotaConsolidada(1200, 0, 12)).toBe(100);
  });
  it("con interés (1000, 12% anual, 12 meses) ≈ 88.85", () => {
    expect(cuotaConsolidada(1000, 12, 12)).toBeCloseTo(88.85, 1);
  });
  it("plazo 0 → 0 (evita división por cero)", () => {
    expect(cuotaConsolidada(1000, 12, 0)).toBe(0);
  });
});

describe("escenarioConsolidado", () => {
  const base = baseline([deuda({ saldo: 1200, cuota: 300, tasa: 24 })]);

  it("baja la cuota → dinero liberado positivo", () => {
    const e = escenarioConsolidado(base, 12, 24);
    expect(e.cuota).toBeLessThan(base.cuotaActual);
    expect(e.dineroLiberadoMes).toBeGreaterThan(0);
    expect(e.meses).toBe(24);
  });

  it("alargar mucho el plazo puede costar más interés (convieneInteres=false)", () => {
    const b = baseline([deuda({ saldo: 5000, cuota: 500, tasa: 20 })]);
    const e = escenarioConsolidado(b, 20, 60); // mismo APR, plazo mucho más largo
    expect(e.interesAhorrado).toBeLessThan(0);
    expect(e.convieneInteres).toBe(false);
  });

  it("clampa tasa y plazo inválidos a rangos válidos", () => {
    const e = escenarioConsolidado(base, -5, -10);
    expect(e.tasa).toBe(0);
    expect(e.meses).toBe(1);
  });
});

describe("clamp", () => {
  it("acota dentro del rango", () => {
    expect(clamp(50, 0, 100)).toBe(50);
    expect(clamp(-5, 0, 100)).toBe(0);
    expect(clamp(150, 0, 100)).toBe(100);
    expect(clamp(NaN, 0, 100)).toBe(0);
  });
});
