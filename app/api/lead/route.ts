import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation";
import { getDb, firestoreDisponible } from "@/lib/firebase-admin";

// firebase-admin necesita el runtime de Node (no Edge).
export const runtime = "nodejs";

// n8n espera un correo. Si el lead eligió WhatsApp o llamada (sin correo), usamos
// este por defecto para que el Lead Engine no falle. Se configura SOLO por env; si no
// está definido, el registro se guarda/manda sin campo `email` (nunca hardcodeamos
// un correo personal en el repo).
const EMAIL_FALLBACK = process.env.LEAD_FALLBACK_EMAIL?.trim() || undefined;

// Límite defensivo: el payload legítimo (nombre, contacto, resumen) son < 1 KB.
// Rechazamos cuerpos grandes antes de parsear para no gastar recursos en abuso.
const MAX_BODY_BYTES = 8 * 1024;

export async function POST(req: Request) {
  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "payload_grande" },
      { status: 413 },
    );
  }

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

  // Correo para n8n: el que dejó el lead si eligió "Correo", o el fallback de env
  // (si está configurado). Puede quedar indefinido.
  const email =
    lead.contactoPreferido === "email" ? lead.contacto : EMAIL_FALLBACK;

  // `lead.resumen` ya es solo agregados: nunca guardamos el detalle por deuda.
  // `email` se incluye solo si existe (Firestore rechaza campos `undefined`).
  const registro = {
    nombre: lead.nombre,
    contacto: lead.contacto,
    contactoPreferido: lead.contactoPreferido,
    ...(email ? { email } : {}),
    consentimiento: lead.consentimiento,
    resumen: lead.resumen,
    fuente: "respira-web",
    createdAt: new Date().toISOString(),
  };

  const webhook = process.env.N8N_WEBHOOK_URL;
  const algunDestinoConfigurado = firestoreDisponible() || Boolean(webhook);

  let firestoreGuardado = false;
  try {
    const db = await getDb();
    if (db) {
      await db.collection("leads").add(registro);
      firestoreGuardado = true;
    }
  } catch (err) {
    // Firestore es la persistencia primaria: si falla, no podemos garantizar el lead.
    console.error("[lead] error guardando en Firestore:", err);
    return NextResponse.json({ ok: false, error: "storage" }, { status: 500 });
  }

  // El webhook es secundario: su fallo NO debe tumbar un guardado en Firestore que sí
  // funcionó, pero tampoco puede tragarse en silencio (antes se perdía el lead sin rastro).
  let webhookEntregado = false;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(registro),
      });
      if (!res.ok) {
        throw new Error(`respuesta ${res.status}`);
      }
      webhookEntregado = true;
    } catch (err) {
      console.error("[lead] error disparando el webhook n8n:", err);
    }
  }

  const stored = firestoreGuardado || webhookEntregado;

  // Había al menos un destino configurado pero ninguno recibió el lead: es un fallo real
  // (p.ej. el webhook era el único destino y no respondió). Propagarlo para que el cliente
  // reintente en vez de mostrar un "éxito" falso mientras el lead se pierde.
  if (algunDestinoConfigurado && !stored) {
    return NextResponse.json(
      { ok: false, error: "delivery" },
      { status: 502 },
    );
  }

  if (!stored) {
    console.warn(
      "[lead] captura activada sin Firebase ni webhook configurados; el lead no se guardó.",
    );
  }
  return NextResponse.json({ ok: true, stored });
}
