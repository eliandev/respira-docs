import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation";
import { getDb } from "@/lib/firebase-admin";

// firebase-admin necesita el runtime de Node (no Edge).
export const runtime = "nodejs";

// n8n espera un correo. Si el lead eligió WhatsApp o llamada (sin correo), mandamos
// este por defecto para que el Lead Engine no falle. Configurable por env.
const EMAIL_FALLBACK =
  process.env.LEAD_FALLBACK_EMAIL ?? "geordymemdoza@gmail.com";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "json_invalido" },
      { status: 400 },
    );
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validacion" },
      { status: 400 },
    );
  }
  const lead = parsed.data;

  // Correo garantizado para n8n: el que dejó el lead si eligió "Correo", o el default.
  const email =
    lead.contactoPreferido === "email" ? lead.contacto : EMAIL_FALLBACK;

  // `lead.resumen` ya es solo agregados: nunca guardamos el detalle por deuda.
  const registro = {
    nombre: lead.nombre,
    contacto: lead.contacto,
    contactoPreferido: lead.contactoPreferido,
    email,
    consentimiento: lead.consentimiento,
    resumen: lead.resumen,
    fuente: "respira-web",
    createdAt: new Date().toISOString(),
  };

  let stored = false;
  try {
    const db = await getDb();
    if (db) {
      await db.collection("leads").add(registro);
      stored = true;
    }

    const webhook = process.env.N8N_WEBHOOK_URL;
    if (webhook) {
      // Dispara el Lead Engine (reto 4). No tumba la respuesta si el webhook falla.
      await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(registro),
      }).catch(() => {});
      stored = true;
    }
  } catch (err) {
    console.error("[lead] error guardando:", err);
    return NextResponse.json({ ok: false, error: "storage" }, { status: 500 });
  }

  if (!stored) {
    console.warn(
      "[lead] captura activada sin Firebase ni webhook configurados; el lead no se guardó.",
    );
  }
  return NextResponse.json({ ok: true, stored });
}
