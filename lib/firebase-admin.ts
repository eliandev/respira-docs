// Admin SDK (solo servidor). Opcional: si faltan las credenciales, getDb() devuelve
// null y la app sigue funcionando (el MVP corre sin persistencia). Este módulo solo
// debe importarse desde código de servidor (app/api/lead/route.ts).
//
// IMPORTANTE: firebase-admin se carga con import DINÁMICO dentro de getDb(), solo
// cuando hay credenciales. Así el MVP (sin env) nunca toca la librería y no arrastra
// sus dependencias nativas (que si no rompen incluso el camino de validación).
import type { Firestore } from "firebase-admin/firestore";

let cached: Firestore | null = null;

export function firestoreDisponible(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

export async function getDb(): Promise<Firestore | null> {
  if (!firestoreDisponible()) return null;
  if (cached) return cached;

  // Import dinámico: solo se evalúa cuando hay credenciales configuradas.
  const { cert, getApps, initializeApp } = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");

  const app =
    getApps()[0] ??
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        // La clave privada viene con saltos de línea escapados en el env.
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      }),
    });

  cached = getFirestore(app);
  return cached;
}
