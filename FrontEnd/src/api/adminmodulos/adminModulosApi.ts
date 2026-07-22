import { peticionAdmin } from "./adminSesionApi";
import type {
  AveAdmin,
  ComunicadoAdmin,
  DatosAdmin,
  EstadoReporteAdmin,
  NuevaAveAdmin,
  NuevoComunicadoAdmin,
  PublicacionAdmin,
  ReporteAdmin,
} from "./tipos";

async function obtenerDatosAdmin(): Promise<DatosAdmin> {
  const [reportes, comunicados, aves, publicaciones] = await Promise.all([
    peticionAdmin<ReporteAdmin[]>("/reportes/"),
    peticionAdmin<ComunicadoAdmin[]>("/comunicados/"),
    peticionAdmin<AveAdmin[]>("/aves/"),
    peticionAdmin<PublicacionAdmin[]>("/publicaciones/"),
  ]);
  return { reportes, comunicados, aves, publicaciones };
}

function actualizarReporte(id: number, estado: EstadoReporteAdmin) {
  return peticionAdmin<ReporteAdmin>(`/reportes/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ estado }),
  });
}

function eliminarReporte(id: number) {
  return peticionAdmin<void>(`/reportes/${id}/`, { method: "DELETE" });
}

function formularioComunicado(datos: NuevoComunicadoAdmin) {
  const formulario = new FormData();
  formulario.append("titulo", datos.titulo.trim());
  formulario.append("descripcion", datos.descripcion.trim());
  formulario.append("fecha", datos.fecha);
  if (datos.imagen) formulario.append("imagen", datos.imagen);
  return formulario;
}

function crearComunicado(datos: NuevoComunicadoAdmin) {
  return peticionAdmin<ComunicadoAdmin>("/comunicados/", {
    method: "POST",
    body: formularioComunicado(datos),
  });
}

function editarComunicado(id: number, datos: NuevoComunicadoAdmin) {
  return peticionAdmin<ComunicadoAdmin>(`/comunicados/${id}/`, {
    method: "PATCH",
    body: formularioComunicado(datos),
  });
}

function cambiarVisibilidadComunicado(id: number, activo: boolean) {
  return peticionAdmin<ComunicadoAdmin>(`/comunicados/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ activo }),
  });
}

function eliminarComunicado(id: number) {
  return peticionAdmin<void>(`/comunicados/${id}/`, { method: "DELETE" });
}

function formularioAve(datos: NuevaAveAdmin, reemplazarImagenes = false) {
  const formulario = new FormData();
  formulario.append("nombre", datos.nombre.trim());
  formulario.append("nombre_cientifico", datos.nombreCientifico.trim());
  formulario.append("etiqueta_caracteristica", datos.etiqueta.trim());
  formulario.append("caracteristicas", datos.caracteristicas.trim());
  formulario.append("descripcion", datos.descripcion.trim());
  formulario.append(
    "atributos",
    JSON.stringify(
      datos.atributos
        .map((atributo) => ({
          nombre: atributo.nombre.trim(),
          valor: atributo.valor.trim(),
          destacado: atributo.destacado,
        }))
        .filter((atributo) => atributo.nombre || atributo.valor),
    ),
  );
  datos.imagenes.forEach((imagen) => formulario.append("imagenes", imagen));
  if (reemplazarImagenes && datos.imagenes.length > 0) {
    formulario.append("reemplazar_imagenes", "true");
  }
  return formulario;
}

function crearAve(datos: NuevaAveAdmin) {
  return peticionAdmin<AveAdmin>("/aves/", {
    method: "POST",
    body: formularioAve(datos),
  });
}

function editarAve(id: number, datos: NuevaAveAdmin) {
  return peticionAdmin<AveAdmin>(`/aves/${id}/`, {
    method: "PATCH",
    body: formularioAve(datos, true),
  });
}

function cambiarVisibilidadAve(id: number, activa: boolean) {
  return peticionAdmin<AveAdmin>(`/aves/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ activa }),
  });
}

function eliminarAve(id: number) {
  return peticionAdmin<void>(`/aves/${id}/`, { method: "DELETE" });
}

function cambiarVisibilidadPublicacion(id: number, activa: boolean) {
  return peticionAdmin<PublicacionAdmin>(`/publicaciones/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ activa }),
  });
}

function eliminarPublicacion(id: number) {
  return peticionAdmin<void>(`/publicaciones/${id}/`, { method: "DELETE" });
}

export {
  actualizarReporte,
  cambiarVisibilidadAve,
  cambiarVisibilidadComunicado,
  cambiarVisibilidadPublicacion,
  crearAve,
  crearComunicado,
  editarAve,
  editarComunicado,
  eliminarAve,
  eliminarComunicado,
  eliminarPublicacion,
  eliminarReporte,
  obtenerDatosAdmin,
};
