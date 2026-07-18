import { peticionAutenticada } from "../LoginApi/clienteApi";
import type {
  AveCatalogoApi,
  AveDesconocidaApi,
  DetalleAveApi,
  ResumenCatalogoApi,
} from "./tipos";

function obtenerResumenCatalogo(signal?: AbortSignal) {
  return peticionAutenticada<ResumenCatalogoApi>("/catalogo/resumen/", {
    signal,
  });
}

function listarAvesCatalogo(signal?: AbortSignal) {
  return peticionAutenticada<AveCatalogoApi[]>("/catalogo/aves/", { signal });
}

function obtenerDetalleAve(idAve: number, signal?: AbortSignal) {
  return peticionAutenticada<DetalleAveApi>(`/catalogo/aves/${idAve}/`, {
    signal,
  });
}

function listarAvesDesconocidas(signal?: AbortSignal) {
  return peticionAutenticada<AveDesconocidaApi[]>(
    "/catalogo/desconocidas/",
    { signal },
  );
}

export {
  listarAvesCatalogo,
  listarAvesDesconocidas,
  obtenerDetalleAve,
  obtenerResumenCatalogo,
};
