import { useCallback, useEffect, useState } from "react";
import { ErrorApi } from "../api/LoginApi/clienteApi";
import { listarPublicaciones } from "../api/NoticiaApi/PublicacionApi/publicacionApi";
import type { PublicacionApi } from "../api/NoticiaApi/PublicacionApi/tipos";

function usePublicaciones() {
  const [publicaciones, setPublicaciones] = useState<PublicacionApi[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarPublicaciones = useCallback(async (signal?: AbortSignal) => {
    setCargando(true);
    setError("");

    try {
      setPublicaciones(await listarPublicaciones(signal));
    } catch (errorDesconocido) {
      if (signal?.aborted) return;
      setError(
        errorDesconocido instanceof ErrorApi
          ? errorDesconocido.message
          : "No se pudieron cargar las publicaciones.",
      );
    } finally {
      if (!signal?.aborted) setCargando(false);
    }
  }, []);

  useEffect(() => {
    const controlador = new AbortController();
    void cargarPublicaciones(controlador.signal);
    return () => controlador.abort();
  }, [cargarPublicaciones]);

  return { publicaciones, cargando, error, cargarPublicaciones };
}

export { usePublicaciones };
