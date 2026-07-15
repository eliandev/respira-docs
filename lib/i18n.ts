// Diccionario de textos (español, voseo — foco El Salvador/LatAm).
// Estructura lista para sumar "en" después: crear otro objeto con la misma forma y
// elegir el locale. Por ahora exportamos `dict` (es) que consumen los componentes.
//
// Tono (PRD §5, AGENTS "Guardrails"): cálido, digno, anti-vergüenza. Nunca alarmista
// ni predatorio. Toda cifra es estimación, nunca promesa.

export const es = {
  common: {
    appName: "Respira",
    continuar: "Continuar",
    volver: "Volver",
    empezar: "Empezar",
    cerrar: "Cerrar",
  },

  nav: {
    pasos: ["Bienvenida", "Tus deudas", "Tu salida", "El primer paso"] as const,
    pasoDe: (actual: number, total: number) => `Paso ${actual} de ${total}`,
  },

  welcome: {
    eyebrow: "Sin cuenta · Anónimo · Privado",
    title: "Salir de deudas no es de irresponsables. Es de valientes.",
    subtitle:
      "Respira te ayuda a ordenar lo que debés y a ver, con calma, tu camino de salida. No somos un banco y no te vendemos un préstamo.",
    privacy:
      "Tus números no salen de tu pantalla. El cálculo corre en tu navegador y no guardamos nada hasta que vos lo decidás.",
    puntos: [
      {
        titulo: "Privado y seguro",
        texto: "El cálculo es 100% en tu navegador. Nada se guarda sin tu permiso.",
      },
      {
        titulo: "Honesto, aunque no te convenga",
        texto: "Si consolidar te hace pagar más interés, te lo decimos claro.",
      },
      {
        titulo: "De tu lado",
        texto: "Al final te conectamos con alguien que negocia por vos, sin juzgarte.",
      },
    ],
    cta: "Empezar",
  },

  debts: {
    title: "Tus deudas",
    subtitle:
      "Agregá lo que debés. No necesitás cifras exactas: una buena estimación ya te da claridad. Todo queda en tu pantalla.",
    addDebt: "Agregar otra deuda",
    addFirst: "Agregar mi primera deuda",
    empty: "Todavía no agregaste ninguna deuda. Empecemos por una.",
    quitar: "Quitar",
    campos: {
      entidad: "Entidad",
      entidadPlaceholder: "Ej. Tarjeta banco, préstamo…",
      saldo: "Saldo actual",
      cuota: "Cuota mensual",
      tasa: "Tasa anual (%)",
    },
    totales: {
      deudaTotal: "Deuda total",
      cuotaTotal: "Cuota mensual total",
      tasaProm: "Tasa promedio",
    },
    ingreso: {
      label: "Ingreso mensual (opcional)",
      ayuda: "Nos ayuda a mostrarte cuánto aire recuperás. Podés dejarlo en blanco.",
    },
    continuar: "Ver mi salida",
    nota: "Podés volver y ajustar estos números cuando quieras.",
  },

  result: {
    title: "Tu salida",
    subtitle: "Comparamos cómo vas hoy con un plan consolidado que podés ajustar.",
    baselineTitle: "A como vas hoy",
    consolidatedTitle: "Con un plan consolidado",
    labels: {
      cuotaMensual: "Cuota mensual",
      tiempo: "Tiempo hasta salir",
      interesTotal: "Interés total estimado",
      dineroLiberado: "Aire que recuperás por mes",
      interesAhorrado: "Interés que ahorrás",
      alivio: "de tu ingreso mensual",
    },
    sliders: {
      tasa: "Tasa anual del nuevo plan",
      plazo: "Plazo del nuevo plan",
      meses: "meses",
    },
    referencia:
      "Tasas de referencia (SSF). Ajustá estos valores a una oferta real cuando la tengas.",
    framing: {
      cuota: (de: string, a: string) => `De ${de} a ${a} por mes`,
      libre: (tiempo: string) => `Libre en ${tiempo}`,
      recuperas: (monto: string) => `Recuperás ${monto} cada mes`,
      subeCuota: (monto: string) => `Pagás ${monto} más por mes, pero salís antes`,
    },
    volverAEditar: "Volver a mis deudas",
    continuar: "Dar el primer paso",
  },

  honesty: {
    tituloAviso: "Para que lo tengas claro",
    peorInteres:
      "Bajás la cuota mensual, pero en total pagás más interés. Te conviene solo si necesitás aire ahora para respirar.",
    mejorInteres:
      "Con este plan bajás la cuota y además pagás menos interés en total.",
    nuncaSePaga: (entidad: string) =>
      `A la cuota actual, tu deuda con ${entidad} casi no baja: los intereses se comen tus pagos. Vale la pena priorizarla.`,
    sinFechaHoy:
      "Hoy, a como vas, no tenés una fecha clara de salida. Un plan ordenado te la puede dar.",
    estimacion: "Esto es una estimación, no una garantía.",
    noAsesoria: "Respira no reemplaza asesoría financiera formal.",
  },

  gauge: {
    titulo: "¿Te conviene por intereses?",
    conviene: "Te conviene",
    parejo: "Casi parejo",
    cuestaMas: "Cuesta más interés",
    ahorras: (monto: string) => `Ahorrás ${monto} en intereses`,
    pagasMas: (monto: string) => `Pagás ${monto} más en intereses`,
    sinFecha: "Hoy no tenés fecha de salida; un plan te la da.",
    leyendaMenos: "Cuesta más",
    leyendaMas: "Ahorrás",
  },

  disclaimer: {
    texto:
      "Los resultados son estimaciones basadas en los datos que ingresaste y en fórmulas estándar de amortización. No son una oferta ni una garantía, y no constituyen asesoría financiera formal. Verificá cualquier decisión con una oferta real y, si podés, con un profesional de confianza.",
  },

  advisor: {
    title: "El primer paso",
    subtitle:
      "Si querés, te acompañamos. Un asesor aliado puede orientarte sin costo y, si aplica, negociar por vos.",
    puntos: [
      "Te atiende sin juzgarte, con la información que ya ordenaste acá.",
      "La orientación inicial es gratuita y sin compromiso.",
      "Está de tu lado: no es un banco vendiéndote otro préstamo.",
    ],
    form: {
      titulo: "Dejá tus datos y te contactamos",
      nombre: "Tu nombre",
      nombrePlaceholder: "¿Cómo te llamás?",
      preferencia: "¿Cómo preferís que te contactemos?",
      opciones: {
        whatsapp: "WhatsApp",
        telefono: "Llamada",
        email: "Correo",
      },
      contactoTelefono: "Tu número",
      contactoEmail: "Tu correo",
      consentimiento:
        "Acepto que Respira use estos datos y un resumen de mi diagnóstico para que un asesor me contacte. No se comparte el detalle de cada deuda.",
      enviar: "Quiero que me contacten",
      enviando: "Enviando…",
      privacidad:
        "Solo guardamos un resumen (deuda total, cuota y alivio estimado). El detalle de cada deuda nunca sale de tu pantalla.",
    },
    exito: {
      titulo: "Listo, respirá.",
      texto:
        "Recibimos tus datos. Un asesor te va a contactar por el medio que elegiste. Mientras tanto, ya tenés claro tu panorama: ese es el primer paso.",
    },
    sinConfig:
      "La captura de contacto no está activada en esta instancia, pero ya diste el paso más importante: ver claro tu panorama.",
    volver: "Volver al resultado",
  },

  resources: {
    titulo: "Recursos gratuitos",
    texto:
      "Aunque no contrates a nadie, informarte es gratis. La Superintendencia del Sistema Financiero (SSF) tiene educación financiera abierta:",
    ssfLabel: "Educación financiera — SSF",
    ssfUrl: "https://edufinanciera.ssf.gob.sv",
  },

  errores: {
    saldoInvalido: "Ingresá un saldo mayor a 0.",
    cuotaInvalida: "Ingresá una cuota mayor a 0.",
    tasaInvalida: "La tasa debe estar entre 0 y 200%.",
    entidadRequerida: "Poné un nombre para reconocerla.",
    nombreRequerido: "Decinos cómo te llamás.",
    contactoRequerido: "Necesitamos un dato para contactarte.",
    emailInvalido: "Revisá el correo.",
    consentimientoRequerido: "Necesitamos tu permiso para poder contactarte.",
    sinDeudas: "Agregá al menos una deuda para ver tu salida.",
  },
} as const;

export type Dict = typeof es;

/** Locale por defecto. Para sumar inglés: `const dict = locale === "en" ? en : es`. */
export const dict = es;
