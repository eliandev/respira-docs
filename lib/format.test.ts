import { describe, it, expect } from "vitest";
import { formatMoneda, formatPorcentaje, formatMeses } from "./format";

describe("formatMoneda", () => {
  it("formatea enteros en USD con separador de miles y sin decimales", () => {
    expect(formatMoneda(1000)).toBe("$1,000");
  });

  it("redondea al entero más cercano por defecto", () => {
    expect(formatMoneda(1234.56)).toBe("$1,235");
  });

  it("con decimales=true muestra dos decimales", () => {
    expect(formatMoneda(1000, true)).toBe("$1,000.00");
    expect(formatMoneda(88.85, true)).toBe("$88.85");
  });

  it("cero se formatea como $0", () => {
    expect(formatMoneda(0)).toBe("$0");
  });

  it("valores no finitos devuelven — (nunca NaN/Infinity crudos)", () => {
    expect(formatMoneda(Infinity)).toBe("—");
    expect(formatMoneda(-Infinity)).toBe("—");
    expect(formatMoneda(NaN)).toBe("—");
  });
});

describe("formatPorcentaje", () => {
  it("usa un decimal por defecto", () => {
    expect(formatPorcentaje(12.34)).toBe("12.3%");
  });

  it("respeta la cantidad de decimales pedida", () => {
    expect(formatPorcentaje(12.345, 2)).toBe("12.35%");
    expect(formatPorcentaje(20, 0)).toBe("20%");
  });

  it("valores no finitos devuelven —", () => {
    expect(formatPorcentaje(Infinity)).toBe("—");
    expect(formatPorcentaje(NaN)).toBe("—");
  });
});

describe("formatMeses", () => {
  it("meses no finitos → 'sin fecha de salida'", () => {
    expect(formatMeses(Infinity)).toBe("sin fecha de salida");
    expect(formatMeses(NaN)).toBe("sin fecha de salida");
  });

  it("cero (o negativo) → '0 meses'", () => {
    expect(formatMeses(0)).toBe("0 meses");
    expect(formatMeses(-5)).toBe("0 meses");
  });

  it("solo meses, singular y plural", () => {
    expect(formatMeses(1)).toBe("1 mes");
    expect(formatMeses(3)).toBe("3 meses");
    expect(formatMeses(11)).toBe("11 meses");
  });

  it("años exactos sin resto de meses", () => {
    expect(formatMeses(12)).toBe("1 año");
    expect(formatMeses(24)).toBe("2 años");
  });

  it("años y meses combinados", () => {
    expect(formatMeses(15)).toBe("1 año y 3 meses");
    expect(formatMeses(25)).toBe("2 años y 1 mes");
  });

  it("redondea meses fraccionarios", () => {
    expect(formatMeses(10.4)).toBe("10 meses");
    expect(formatMeses(11.6)).toBe("1 año"); // 12 redondeado
  });
});
