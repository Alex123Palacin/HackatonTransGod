import { peticionAutenticada } from "../../LoginApi/clienteApi";
import type { DatosReporte, ReporteApi } from "./tipos";

function listarMisReportes(signal?: AbortSignal): Promise<ReporteApi[]> {
  return peticionAutenticada<ReporteApi[]>("/noticias/reportes/", { signal });
}

function crearReporte(datos: DatosReporte): Promise<ReporteApi> {
  const formulario = new FormData();
  formulario.append("titulo", datos.titulo.trim());
  formulario.append("descripcion", datos.descripcion.trim());
  if (datos.imagen) formulario.append("imagen", datos.imagen);

  return peticionAutenticada<ReporteApi>("/noticias/reportes/", {
    method: "POST",
    body: formulario,
  });
}

export { crearReporte, listarMisReportes };
