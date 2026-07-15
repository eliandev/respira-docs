// Flag público: controla si se muestra el formulario de contacto (Paso 4).
// Si está apagado, el formulario NO se renderiza y ningún dato sale del navegador
// (privacidad por diseño). Activar con NEXT_PUBLIC_LEAD_CAPTURE=on además de
// configurar Firebase y/o el webhook n8n en el servidor.
export const LEAD_CAPTURE_ENABLED =
  process.env.NEXT_PUBLIC_LEAD_CAPTURE === "on";
