import { useCallback, useEffect, useMemo, useState } from "react";
import { ErrorApi } from "../api/LoginApi/clienteApi";
import {
  listarAvesCatalogo,
  listarAvesDesconocidas,
  obtenerResumenCatalogo,
} from "../api/CatalogoApi/catalogoApi";
import type {
  AveCatalogoApi,
  AveDesconocidaApi,
  ResumenCatalogoApi,
} from "../api/CatalogoApi/tipos";

const resumenInicial: ResumenCatalogoApi = {
  encontradas: 0,
  total: 0,
  porcentaje: 0,
};

function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function useCatalogo() {
  const [resumen, setResumen] = useState(resumenInicial);
  const [aves, setAves] = useState<AveCatalogoApi[]>([]);
  const [desconocidas, setDesconocidas] = useState<AveDesconocidaApi[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarCatalogo = useCallback(async (signal?: AbortSignal) => {
    setCargando(true);
    setError("");
    try {
      const [nuevoResumen, nuevasAves, nuevasDesconocidas] = await Promise.all([
        obtenerResumenCatalogo(signal),
        listarAvesCatalogo(signal),
        listarAvesDesconocidas(signal),
      ]);
      setResumen(nuevoResumen);
      setAves(nuevasAves);
      setDesconocidas(nuevasDesconocidas);
    } catch (errorDesconocido) {
      if (signal?.aborted) return;
      setError(
        errorDesconocido instanceof ErrorApi
          ? errorDesconocido.message
          : "No se pudo cargar el catalogo.",
      );
    } finally {
      if (!signal?.aborted) setCargando(false);
    }
  }, []);

  useEffect(() => {
    let controlador = new AbortController();
    const actualizar = () => {
      controlador.abort();
      controlador = new AbortController();
      void cargarCatalogo(controlador.signal);
    };

    actualizar();
    window.addEventListener("focus", actualizar);
    return () => {
      controlador.abort();
      window.removeEventListener("focus", actualizar);
    };
  }, [cargarCatalogo]);

  const avesFiltradas = useMemo(() => {
    const termino = normalizarTexto(busqueda);
    if (!termino) return aves;
    return aves.filter((ave) =>
      normalizarTexto(`${ave.nombre} ${ave.nombre_cientifico}`).includes(termino),
    );
  }, [aves, busqueda]);

  return {
    resumen,
    aves: avesFiltradas,
    desconocidas,
    busqueda,
    setBusqueda,
    cargando,
    error,
    cargarCatalogo,
  };
}

export { useCatalogo };
