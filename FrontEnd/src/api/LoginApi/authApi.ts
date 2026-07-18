import {
  actualizarUsuario,
  guardarSesion,
  limpiarSesion,
  obtenerSesion,
} from "./authStorage";
import { peticionAutenticada, peticionPublica } from "./clienteApi";
import type {
  CredencialesLogin,
  DatosRegistro,
  Sesion,
  UsuarioSesion,
} from "./tipos";

async function registrarUsuario(datos: DatosRegistro): Promise<UsuarioSesion> {
  return peticionPublica<UsuarioSesion>("/auth/registro/", {
    method: "POST",
    body: JSON.stringify({
      ...datos,
      nombre: datos.nombre.trim(),
      correo: datos.correo.trim().toLowerCase(),
    }),
  });
}

async function iniciarSesion(datos: CredencialesLogin): Promise<UsuarioSesion> {
  const sesion = await peticionPublica<Sesion>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({
      ...datos,
      correo: datos.correo.trim().toLowerCase(),
    }),
  });
  guardarSesion(sesion);
  return sesion.usuario;
}

async function obtenerPerfil(): Promise<UsuarioSesion> {
  const usuario = await peticionAutenticada<UsuarioSesion>("/auth/me/");
  actualizarUsuario(usuario);
  return usuario;
}

async function registrarActividadSesion(): Promise<void> {
  await peticionAutenticada<void>("/auth/actividad/", { method: "POST" });
}

async function cerrarSesion(): Promise<void> {
  const sesion = obtenerSesion();
  try {
    if (sesion) {
      await peticionAutenticada<void>("/auth/logout/", {
        method: "POST",
      });
    }
  } finally {
    limpiarSesion();
  }
}

export {
  cerrarSesion,
  iniciarSesion,
  obtenerPerfil,
  registrarActividadSesion,
  registrarUsuario,
};
