import { useCallback, useEffect, useState } from "react";
import { ErrorApi } from "../api/LoginApi/clienteApi";
import { listarMisReportes } from "../api/NoticiaApi/ReporteApi/reporteApi";
import type { ReporteApi } from "../api/NoticiaApi/ReporteApi/tipos";

function useReportes() {
  const [reportes, setReportes] = useState<ReporteApi[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarReportes = useCallback(async (signal?: AbortSignal) => {
    setCargando(true);
    setError("");
    try {
      setReportes(await listarMisReportes(signal));
    } catch (errorDesconocido) {
      if (signal?.aborted) return;
      setError(
        errorDesconocido instanceof ErrorApi
          ? errorDesconocido.message
          : "No se pudieron cargar tus reportes.",
      );
    } finally {
      if (!signal?.aborted) setCargando(false);
    }
  }, []);

  useEffect(() => {
    const controlador = new AbortController();
    void cargarReportes(controlador.signal);
    return () => controlador.abort();
  }, [cargarReportes]);

  return { reportes, cargando, error, cargarReportes };
}

export { useReportes };
