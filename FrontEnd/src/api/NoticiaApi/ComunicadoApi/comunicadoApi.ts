import { peticionAutenticada } from "../../LoginApi/clienteApi";
import type { ComunicadoApi } from "./tipos";

function listarComunicados(signal?: AbortSignal): Promise<ComunicadoApi[]> {
  return peticionAutenticada<ComunicadoApi[]>("/noticias/comunicados/", {
    signal,
  });
}

export { listarComunicados };
