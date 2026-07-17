import { describe, it, expect, afterEach, vi } from "vitest";

const ORIGINAL = process.env.NEXT_PUBLIC_LEAD_CAPTURE;

// El flag se evalúa al importar el módulo, así que reseteamos módulos y env
// entre casos para leer cada combinación desde cero.
async function loadFlag(value: string | undefined) {
  vi.resetModules();
  if (value === undefined) {
    delete process.env.NEXT_PUBLIC_LEAD_CAPTURE;
  } else {
    process.env.NEXT_PUBLIC_LEAD_CAPTURE = value;
  }
  const mod = await import("./config");
  return mod.LEAD_CAPTURE_ENABLED;
}

afterEach(() => {
  if (ORIGINAL === undefined) delete process.env.NEXT_PUBLIC_LEAD_CAPTURE;
  else process.env.NEXT_PUBLIC_LEAD_CAPTURE = ORIGINAL;
});

describe("LEAD_CAPTURE_ENABLED", () => {
  it("es true solo cuando la variable es exactamente 'on'", async () => {
    expect(await loadFlag("on")).toBe(true);
  });

  it("es false cuando no está definida", async () => {
    expect(await loadFlag(undefined)).toBe(false);
  });

  it("es false para cualquier otro valor (privacidad por defecto)", async () => {
    expect(await loadFlag("off")).toBe(false);
    expect(await loadFlag("true")).toBe(false);
    expect(await loadFlag("ON")).toBe(false);
    expect(await loadFlag("1")).toBe(false);
  });
});
