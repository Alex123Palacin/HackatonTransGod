import type { SesionAdmin } from "./tipos";

const API_URL = (import.meta.env.VITE_API_URL?.trim() || "/api").replace(
  /\/+$/,
  "",
);
const CLAVE_SESION_ADMIN = "poza_arenilla_sesion_admin";
const EVENTO_SESION_ADMIN_CERRADA = "poza:sesion-admin-cerrada";

class ErrorAdminApi extends Error {
  status: number;
  detalles: unknown;

  constructor(mensaje: string, status: number, detalles: unknown) {
    super(mensaje);
    this.name = "ErrorAdminApi";
    this.status = status;
    this.detalles = detalles;
  }
}

function primerMensaje(valor: unknown): string | null {
  if (typeof valor === "string") return valor;
  if (Array.isArray(valor)) {
    for (const elemento of valor) {
      const mensaje = primerMensaje(elemento);
      if (mensaje) return mensaje;
    }
  }
  if (valor && typeof valor === "object") {
    const objeto = valor as Record<string, unknown>;
    if (objeto.detail) {
      const mensaje = primerMensaje(objeto.detail);
      if (mensaje) return mensaje;
    }
    for (const elemento of Object.values(objeto)) {
      const mensaje = primerMensaje(elemento);
      if (mensaje) return mensaje;
    }
  }
  return null;
}

function guardarSesionAdmin(sesion: SesionAdmin) {
  sessionStorage.setItem(CLAVE_SESION_ADMIN, JSON.stringify(sesion));
}

function leerSesionAdmin(): SesionAdmin | null {
  const valor = sessionStorage.getItem(CLAVE_SESION_ADMIN);
  if (!valor) return null;
  try {
    const sesion = JSON.parse(valor) as Partial<SesionAdmin>;
    if (
      sesion.usuario &&
      typeof sesion.usuario.id === "number" &&
      typeof sesion.csrfToken === "string"
    ) {
      return sesion as SesionAdmin;
    }
  } catch {
    // Una copia local corrupta se descarta; la cookie del servidor es la autoridad.
  }
  limpiarSesionAdmin();
  return null;
}

function limpiarSesionAdmin(notificar = false) {
  sessionStorage.removeItem(CLAVE_SESION_ADMIN);
  if (notificar) window.dispatchEvent(new Event(EVENTO_SESION_ADMIN_CERRADA));
}

function leerCookie(nombre: string): string | null {
  const prefijo = `${encodeURIComponent(nombre)}=`;
  const cookie = document.cookie
    .split(";")
    .map((parte) => parte.trim())
    .find((parte) => parte.startsWith(prefijo));
  if (!cookie) return null;
  try {
    return decodeURIComponent(cookie.slice(prefijo.length));
  } catch {
    return cookie.slice(prefijo.length);
  }
}

function esMetodoSeguro(metodo: string) {
  return ["GET", "HEAD", "OPTIONS"].includes(metodo);
}

function esRespuestaDeSesionVencida(status: number, datos: unknown) {
  if (status === 401) return true;
  if (status !== 403) return false;

  const mensaje = (primerMensaje(datos) ?? "").toLowerCase();
  return (
    mensaje.includes("cuenta administrativa activa") ||
    mensaje.includes("sesion administrativa ha vencido") ||
    mensaje.includes("authentication credentials were not provided")
  );
}

async function leerRespuesta(respuesta: Response): Promise<unknown> {
  if (respuesta.status === 204) return null;
  const contenido = await respuesta.text();
  if (!contenido) return null;
  try {
    return JSON.parse(contenido) as unknown;
  } catch {
    return contenido;
  }
}

async function peticionAdmin<T>(
  ruta: string,
  opciones: RequestInit = {},
  permitirReintentoCsrf = true,
): Promise<T> {
  const headers = new Headers(opciones.headers);
  const metodo = (opciones.method || "GET").toUpperCase();
  const sesion = leerSesionAdmin();

  headers.set("Accept", "application/json");
  if (
    opciones.body &&
    !(opciones.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }
  if (!esMetodoSeguro(metodo)) {
    const csrfToken = leerCookie("csrftoken") ?? sesion?.csrfToken;
    if (csrfToken) headers.set("X-CSRFToken", csrfToken);
  }

  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_URL}/adminmodulos${ruta}`, {
      ...opciones,
      headers,
      credentials: "include",
    });
  } catch (error) {
    throw new ErrorAdminApi(
      "No se pudo conectar con el servidor administrativo.",
      0,
      error,
    );
  }

  const datos = await leerRespuesta(respuesta);
  if (!respuesta.ok) {
    if (esRespuestaDeSesionVencida(respuesta.status, datos)) {
      limpiarSesionAdmin(true);
    } else if (
      respuesta.status === 403 &&
      !esMetodoSeguro(metodo) &&
      permitirReintentoCsrf &&
      sesion
    ) {
      try {
        const sesionActual = await peticionAdmin<SesionAdmin>(
          "/sesion/actual/",
          {},
          false,
        );
        guardarSesionAdmin(sesionActual);
        return peticionAdmin<T>(ruta, opciones, false);
      } catch (errorRenovacion) {
        if (
          errorRenovacion instanceof ErrorAdminApi &&
          esRespuestaDeSesionVencida(
            errorRenovacion.status,
            errorRenovacion.detalles,
          )
        ) {
          throw errorRenovacion;
        }
      }
    }
    throw new ErrorAdminApi(
      primerMensaje(datos) ?? "No se pudo completar la operacion.",
      respuesta.status,
      datos,
    );
  }
  return datos as T;
}

async function iniciarSesionAdmin(usuario: string, password: string) {
  const sesion = await peticionAdmin<SesionAdmin>("/sesion/iniciar/", {
    method: "POST",
    body: JSON.stringify({ usuario: usuario.trim(), password }),
  });
  guardarSesionAdmin(sesion);
  return sesion;
}

async function comprobarSesionAdmin() {
  const sesion = await peticionAdmin<SesionAdmin>("/sesion/actual/");
  guardarSesionAdmin(sesion);
  return sesion;
}

async function cerrarSesionAdmin() {
  try {
    if (leerSesionAdmin()) {
      await peticionAdmin<void>("/sesion/cerrar/", { method: "POST" });
    }
  } finally {
    limpiarSesionAdmin();
  }
}

export {
  EVENTO_SESION_ADMIN_CERRADA,
  ErrorAdminApi,
  cerrarSesionAdmin,
  comprobarSesionAdmin,
  iniciarSesionAdmin,
  leerSesionAdmin,
  peticionAdmin,
};
