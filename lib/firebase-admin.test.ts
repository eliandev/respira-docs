import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";

const CREDS = {
  FIREBASE_PROJECT_ID: "proj",
  FIREBASE_CLIENT_EMAIL: "svc@proj.iam.gserviceaccount.com",
  FIREBASE_PRIVATE_KEY: "-----BEGIN KEY-----\\nabc\\n-----END KEY-----",
};

const KEYS = Object.keys(CREDS) as (keyof typeof CREDS)[];
const ORIGINAL = KEYS.map((k) => [k, process.env[k]] as const);

function setCreds(partial: Partial<typeof CREDS>) {
  for (const k of KEYS) {
    if (partial[k] === undefined) delete process.env[k];
    else process.env[k] = partial[k] as string;
  }
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  for (const [k, v] of ORIGINAL) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  vi.clearAllMocks();
  vi.doUnmock("firebase-admin/app");
  vi.doUnmock("firebase-admin/firestore");
});

describe("firestoreDisponible", () => {
  it("true solo cuando están las tres variables", async () => {
    setCreds(CREDS);
    const { firestoreDisponible } = await import("./firebase-admin");
    expect(firestoreDisponible()).toBe(true);
  });

  it("false si falta alguna credencial", async () => {
    setCreds({ FIREBASE_PROJECT_ID: CREDS.FIREBASE_PROJECT_ID });
    const { firestoreDisponible } = await import("./firebase-admin");
    expect(firestoreDisponible()).toBe(false);
  });

  it("false sin ninguna credencial", async () => {
    setCreds({});
    const { firestoreDisponible } = await import("./firebase-admin");
    expect(firestoreDisponible()).toBe(false);
  });
});

describe("getDb", () => {
  it("devuelve null cuando no hay credenciales (MVP sin persistencia)", async () => {
    setCreds({});
    const { getDb } = await import("./firebase-admin");
    await expect(getDb()).resolves.toBeNull();
  });

  it("inicializa firebase-admin y cachea el Firestore cuando hay credenciales", async () => {
    setCreds(CREDS);

    const fakeDb = { collection: vi.fn() };
    const cert = vi.fn(() => ({ __cred: true }));
    const getApps = vi.fn(() => []);
    const initializeApp = vi.fn(() => ({ name: "app" }));
    const getFirestore = vi.fn(() => fakeDb);

    vi.doMock("firebase-admin/app", () => ({ cert, getApps, initializeApp }));
    vi.doMock("firebase-admin/firestore", () => ({ getFirestore }));

    const { getDb } = await import("./firebase-admin");
    const db1 = await getDb();
    expect(db1).toBe(fakeDb);
    expect(initializeApp).toHaveBeenCalledTimes(1);
    // la clave privada se des-escapa (\n literales → saltos reales)
    expect(cert).toHaveBeenCalledWith(
      expect.objectContaining({
        privateKey: "-----BEGIN KEY-----\nabc\n-----END KEY-----",
      }),
    );

    // segunda llamada usa el cache: no reinicializa
    const db2 = await getDb();
    expect(db2).toBe(fakeDb);
    expect(initializeApp).toHaveBeenCalledTimes(1);
    expect(getFirestore).toHaveBeenCalledTimes(1);
  });

  it("reutiliza la app existente si ya hay una inicializada", async () => {
    setCreds(CREDS);

    const fakeDb = { collection: vi.fn() };
    const existingApp = { name: "existing" };
    const cert = vi.fn(() => ({ __cred: true }));
    const getApps = vi.fn(() => [existingApp]);
    const initializeApp = vi.fn(() => ({ name: "nueva" }));
    const getFirestore = vi.fn(() => fakeDb);

    vi.doMock("firebase-admin/app", () => ({ cert, getApps, initializeApp }));
    vi.doMock("firebase-admin/firestore", () => ({ getFirestore }));

    const { getDb } = await import("./firebase-admin");
    await getDb();
    expect(initializeApp).not.toHaveBeenCalled();
    expect(getFirestore).toHaveBeenCalledWith(existingApp);
  });
});
