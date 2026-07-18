import type { Sesion, TokensSesion, UsuarioSesion } from "./tipos";

const CLAVE_SESION = "poza_arenilla_sesion";
const CLAVE_ULTIMA_ACTIVIDAD = "poza_arenilla_ultima_actividad";

function esSesionValida(valor: unknown): valor is Sesion {
  if (!valor || typeof valor !== "object") return false;

  const sesion = valor as Partial<Sesion>;
  return Boolean(
    sesion.access &&
      sesion.refresh &&
      sesion.usuario &&
      typeof sesion.usuario.id_usuario === "number" &&
      sesion.usuario.correo,
  );
}

function obtenerSesion(): Sesion | null {
  const sesionGuardada = sessionStorage.getItem(CLAVE_SESION);
  if (!sesionGuardada) return null;

  try {
    const sesion: unknown = JSON.parse(sesionGuardada);
    if (esSesionValida(sesion)) return sesion;
  } catch {
    // Una sesion corrupta se descarta para forzar un acceso limpio.
  }

  limpiarSesion();
  return null;
}

function guardarSesion(sesion: Sesion) {
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  marcarUltimaActividad();
}

function actualizarTokens(tokens: TokensSesion) {
  const sesion = obtenerSesion();
  if (!sesion) return;
  guardarSesion({ ...sesion, ...tokens });
}

function actualizarUsuario(usuario: UsuarioSesion) {
  const sesion = obtenerSesion();
  if (!sesion) return;
  guardarSesion({ ...sesion, usuario });
}

function limpiarSesion() {
  sessionStorage.removeItem(CLAVE_SESION);
  sessionStorage.removeItem(CLAVE_ULTIMA_ACTIVIDAD);
}

function marcarUltimaActividad(fecha = Date.now()) {
  sessionStorage.setItem(CLAVE_ULTIMA_ACTIVIDAD, String(fecha));
}

function obtenerUltimaActividad(): number {
  const valor = Number(sessionStorage.getItem(CLAVE_ULTIMA_ACTIVIDAD));
  if (Number.isFinite(valor) && valor > 0) return valor;
  const ahora = Date.now();
  marcarUltimaActividad(ahora);
  return ahora;
}

export {
  actualizarTokens,
  actualizarUsuario,
  guardarSesion,
  limpiarSesion,
  marcarUltimaActividad,
  obtenerSesion,
  obtenerUltimaActividad,
};
