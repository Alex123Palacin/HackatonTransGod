import { peticionAutenticada } from "../../LoginApi/clienteApi";
import type { DatosPublicacion, PublicacionApi } from "./tipos";

function listarPublicaciones(signal?: AbortSignal): Promise<PublicacionApi[]> {
  return peticionAutenticada<PublicacionApi[]>("/noticias/publicaciones/", {
    signal,
  });
}

function crearPublicacion(datos: DatosPublicacion): Promise<PublicacionApi> {
  const formulario = new FormData();
  formulario.append("titulo", datos.titulo.trim());
  formulario.append("descripcion", datos.descripcion.trim());
  datos.imagenes.forEach((imagen) => formulario.append("imagenes", imagen));

  return peticionAutenticada<PublicacionApi>("/noticias/publicaciones/", {
    method: "POST",
    body: formulario,
  });
}

export { crearPublicacion, listarPublicaciones };
