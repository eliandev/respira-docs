import { describe, it, expect } from "vitest";
import { es, dict } from "./i18n";

describe("dict / es", () => {
  it("dict es el diccionario español por defecto", () => {
    expect(dict).toBe(es);
  });

  it("hay 4 pasos de navegación (welcome→debts→result→advisor)", () => {
    expect(es.nav.pasos).toHaveLength(4);
  });

  it("los recursos apuntan a educación financiera de la SSF", () => {
    expect(es.resources.ssfUrl).toBe("https://edufinanciera.ssf.gob.sv");
  });
});

describe("helpers de texto (interpolación)", () => {
  it("nav.pasoDe arma 'Paso X de Y'", () => {
    expect(es.nav.pasoDe(2, 4)).toBe("Paso 2 de 4");
  });

  it("result.framing compone los mensajes emocionales", () => {
    expect(es.result.framing.cuota("$350", "$280")).toBe("De $350 a $280 por mes");
    expect(es.result.framing.libre("1 año")).toBe("Libre en 1 año");
    expect(es.result.framing.recuperas("$70")).toBe("Recuperás $70 cada mes");
    expect(es.result.framing.subeCuota("$20")).toBe(
      "Pagás $20 más por mes, pero salís antes",
    );
  });

  it("gauge distingue ahorro de sobrecosto de intereses", () => {
    expect(es.gauge.ahorras("$120")).toBe("Ahorrás $120 en intereses");
    expect(es.gauge.pagasMas("$120")).toBe("Pagás $120 más en intereses");
  });

  it("honesty.nuncaSePaga menciona la entidad", () => {
    expect(es.honesty.nuncaSePaga("Tarjeta X")).toContain("Tarjeta X");
  });
});
