type TipoDispositivo = "camara" | "microfono";

let solicitudesActivas = 0;
let ultimaSolicitudFinalizada = 0;

class ErrorPermisoDispositivo extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ErrorPermisoDispositivo";
  }
}

function nombreDispositivo(tipo: TipoDispositivo) {
  return tipo === "camara" ? "camara" : "microfono";
}

function mensajeErrorDispositivo(
  tipo: TipoDispositivo,
  error: unknown,
) {
  const dispositivo = nombreDispositivo(tipo);
  const nombreError = error instanceof DOMException ? error.name : "";

  if (nombreError === "NotAllowedError" || nombreError === "SecurityError") {
    if (window.self !== window.top) {
      return `Abre la aplicacion en una pestana nueva para permitir la ${dispositivo}.`;
    }
    return `El permiso de la ${dispositivo} esta bloqueado. Habilitalo desde los permisos del sitio y vuelve a intentarlo.`;
  }

  if (nombreError === "NotFoundError" || nombreError === "DevicesNotFoundError") {
    return `No se encontro una ${dispositivo} disponible.`;
  }

  if (nombreError === "NotReadableError" || nombreError === "TrackStartError") {
    return `No se pudo usar la ${dispositivo}. Puede estar ocupada por otra aplicacion.`;
  }

  if (nombreError === "OverconstrainedError") {
    return `La ${dispositivo} disponible no admite la configuracion solicitada.`;
  }

  return `No se pudo acceder a la ${dispositivo}. Intentalo nuevamente.`;
}

async function solicitarAccesoDispositivo(
  tipo: TipoDispositivo,
  restricciones: MediaStreamConstraints,
) {
  const dispositivo = nombreDispositivo(tipo);

  if (typeof window === "undefined" || !window.isSecureContext) {
    throw new ErrorPermisoDispositivo(
      `El navegador bloquea la ${dispositivo} en HTTP. Usa HTTPS o abre la app mediante localhost en esta computadora.`,
    );
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    throw new ErrorPermisoDispositivo(
      `Este navegador no permite usar la ${dispositivo}.`,
    );
  }

  solicitudesActivas += 1;
  try {
    return await navigator.mediaDevices.getUserMedia(restricciones);
  } catch (error) {
    throw new ErrorPermisoDispositivo(
      mensajeErrorDispositivo(tipo, error),
    );
  } finally {
    solicitudesActivas = Math.max(0, solicitudesActivas - 1);
    ultimaSolicitudFinalizada = Date.now();
  }
}

function haySolicitudDispositivoReciente() {
  return solicitudesActivas > 0 || Date.now() - ultimaSolicitudFinalizada < 1500;
}

function detenerStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((pista) => pista.stop());
}

export {
  ErrorPermisoDispositivo,
  detenerStream,
  haySolicitudDispositivoReciente,
  solicitarAccesoDispositivo,
};
export type { TipoDispositivo };
