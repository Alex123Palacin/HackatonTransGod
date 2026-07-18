import {
  actualizarTokens,
  limpiarSesion,
  obtenerSesion,
} from "./authStorage";
import type { RespuestaRenovacion } from "./tipos";

const API_URL = (import.meta.env.VITE_API_URL?.trim() || "/api").replace(
  /\/+$/,
  "",
);

class ErrorApi extends Error {
  status: number;
  detalles: unknown;

  constructor(mensaje: string, status: number, detalles: unknown) {
    super(mensaje);
    this.name = "ErrorApi";
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
      const detalle = primerMensaje(objeto.detail);
      if (detalle) return detalle;
    }

    for (const elemento of Object.values(objeto)) {
      const mensaje = primerMensaje(elemento);
      if (mensaje) return mensaje;
    }
  }

  return null;
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

async function validarRespuesta<T>(respuesta: Response): Promise<T> {
  const datos = await leerRespuesta(respuesta);
  if (!respuesta.ok) {
    throw new ErrorApi(
      primerMensaje(datos) ?? "No se pudo completar la solicitud.",
      respuesta.status,
      datos,
    );
  }
  return datos as T;
}

function prepararOpciones(opciones: RequestInit, access?: string): RequestInit {
  const headers = new Headers(opciones.headers);
  headers.set("Accept", "application/json");
  if (
    opciones.body &&
    !(opciones.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }
  if (access) headers.set("Authorization", `Bearer ${access}`);

  return { ...opciones, headers };
}

async function solicitar(ruta: string, opciones: RequestInit): Promise<Response> {
  try {
    return await fetch(`${API_URL}${ruta}`, opciones);
  } catch (error) {
    throw new ErrorApi(
      "No se pudo conectar con el servidor. Comprueba que Django este iniciado.",
      0,
      error,
    );
  }
}

async function peticionPublica<T>(
  ruta: string,
  opciones: RequestInit = {},
): Promise<T> {
  const respuesta = await solicitar(ruta, prepararOpciones(opciones));
  return validarRespuesta<T>(respuesta);
}

let renovacionEnCurso: Promise<string | null> | null = null;

async function renovarAccessToken(): Promise<string | null> {
  if (renovacionEnCurso) return renovacionEnCurso;

  renovacionEnCurso = (async () => {
    const sesion = obtenerSesion();
    if (!sesion) return null;

    try {
      const respuesta = await solicitar(
        "/auth/refresh/",
        prepararOpciones({
          method: "POST",
          body: JSON.stringify({ refresh: sesion.refresh }),
        }),
      );
      const tokens = await validarRespuesta<RespuestaRenovacion>(respuesta);
      actualizarTokens({
        access: tokens.access,
        refresh: tokens.refresh ?? sesion.refresh,
      });
      return tokens.access;
    } catch {
      limpiarSesion();
      return null;
    } finally {
      renovacionEnCurso = null;
    }
  })();

  return renovacionEnCurso;
}

async function peticionAutenticada<T>(
  ruta: string,
  opciones: RequestInit = {},
): Promise<T> {
  const sesion = obtenerSesion();
  if (!sesion) {
    throw new ErrorApi("Debes iniciar sesion.", 401, null);
  }

  let respuesta = await solicitar(
    ruta,
    prepararOpciones(opciones, sesion.access),
  );

  if (respuesta.status === 401) {
    const nuevoAccess = await renovarAccessToken();
    if (!nuevoAccess) {
      throw new ErrorApi("Tu sesion ha vencido.", 401, null);
    }
    respuesta = await solicitar(
      ruta,
      prepararOpciones(opciones, nuevoAccess),
    );
  }

  return validarRespuesta<T>(respuesta);
}

export { ErrorApi, peticionAutenticada, peticionPublica };
