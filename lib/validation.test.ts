import { describe, it, expect } from "vitest";
import { deudaSchema, resumenSchema, leadSchema } from "./validation";

const resumenValido = {
  deudaTotal: 3000,
  cuotaActual: 350,
  cuotaConsolidada: 280,
  dineroLiberadoMes: 70,
  interesAhorrado: 120,
  mesesActual: 10,
  mesesConsolidado: 12,
  hayDeudaImpagable: false,
  cantidadDeudas: 2,
};

describe("deudaSchema", () => {
  const base = { id: "a", entidad: "Banco", saldo: 1000, cuota: 100, tasa: 40 };

  it("acepta una deuda válida", () => {
    expect(deudaSchema.safeParse(base).success).toBe(true);
  });

  it("recorta la entidad y exige al menos un carácter", () => {
    expect(deudaSchema.safeParse({ ...base, entidad: "   " }).success).toBe(false);
    expect(deudaSchema.safeParse({ ...base, entidad: "" }).success).toBe(false);
  });

  it("saldo y cuota deben ser positivos", () => {
    expect(deudaSchema.safeParse({ ...base, saldo: 0 }).success).toBe(false);
    expect(deudaSchema.safeParse({ ...base, saldo: -1 }).success).toBe(false);
    expect(deudaSchema.safeParse({ ...base, cuota: 0 }).success).toBe(false);
  });

  it("tasa admite 0..200 y rechaza fuera de rango", () => {
    expect(deudaSchema.safeParse({ ...base, tasa: 0 }).success).toBe(true);
    expect(deudaSchema.safeParse({ ...base, tasa: 200 }).success).toBe(true);
    expect(deudaSchema.safeParse({ ...base, tasa: -1 }).success).toBe(false);
    expect(deudaSchema.safeParse({ ...base, tasa: 201 }).success).toBe(false);
  });
});

describe("resumenSchema", () => {
  it("acepta un resumen agregado válido", () => {
    expect(resumenSchema.safeParse(resumenValido).success).toBe(true);
  });

  it("mesesActual puede ser null (deuda impagable, no se serializa Infinity)", () => {
    expect(
      resumenSchema.safeParse({ ...resumenValido, mesesActual: null }).success,
    ).toBe(true);
  });

  it("cantidadDeudas debe ser entero no negativo", () => {
    expect(
      resumenSchema.safeParse({ ...resumenValido, cantidadDeudas: -1 }).success,
    ).toBe(false);
    expect(
      resumenSchema.safeParse({ ...resumenValido, cantidadDeudas: 1.5 }).success,
    ).toBe(false);
  });
});

describe("leadSchema", () => {
  const base = {
    nombre: "Ana",
    contacto: "+50370000000",
    contactoPreferido: "whatsapp" as const,
    consentimiento: true as const,
    resumen: resumenValido,
  };

  it("acepta un lead válido por WhatsApp", () => {
    expect(leadSchema.safeParse(base).success).toBe(true);
  });

  it("exige consentimiento explícito (literal true)", () => {
    const r = leadSchema.safeParse({ ...base, consentimiento: false });
    expect(r.success).toBe(false);
  });

  it("recorta el nombre y exige contenido", () => {
    expect(leadSchema.safeParse({ ...base, nombre: "   " }).success).toBe(false);
  });

  it("con preferencia email valida el formato del correo", () => {
    const malo = leadSchema.safeParse({
      ...base,
      contactoPreferido: "email",
      contacto: "no-es-un-email",
    });
    expect(malo.success).toBe(false);
    if (!malo.success) {
      const issue = malo.error.issues.find((i) => i.path[0] === "contacto");
      expect(issue?.message).toBe("email_invalido");
    }

    const bueno = leadSchema.safeParse({
      ...base,
      contactoPreferido: "email",
      contacto: "ana@example.com",
    });
    expect(bueno.success).toBe(true);
  });

  it("no valida formato de email cuando la preferencia no es email", () => {
    const r = leadSchema.safeParse({
      ...base,
      contactoPreferido: "telefono",
      contacto: "7000-0000",
    });
    expect(r.success).toBe(true);
  });

  it("rechaza un contactoPreferido no permitido", () => {
    const r = leadSchema.safeParse({ ...base, contactoPreferido: "paloma" });
    expect(r.success).toBe(false);
  });
});
