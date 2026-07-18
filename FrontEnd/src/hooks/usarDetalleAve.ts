import { useEffect, useState } from "react";
import { obtenerDetalleAve } from "../api/CatalogoApi/catalogoApi";
import type { DetalleAveApi } from "../api/CatalogoApi/tipos";
import { ErrorApi } from "../api/LoginApi/clienteApi";

function useDetalleAve(idAve?: number) {
  const [ave, setAve] = useState<DetalleAveApi | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controlador = new AbortController();
    if (!idAve) {
      setError("El ave seleccionada no es valida.");
      setCargando(false);
      return () => controlador.abort();
    }
    const id = idAve;

    async function cargarDetalle() {
      setCargando(true);
      setError("");
      try {
        setAve(await obtenerDetalleAve(id, controlador.signal));
      } catch (errorDesconocido) {
        if (controlador.signal.aborted) return;
        setError(
          errorDesconocido instanceof ErrorApi
            ? errorDesconocido.message
            : "No se pudo cargar la informacion del ave.",
        );
      } finally {
        if (!controlador.signal.aborted) setCargando(false);
      }
    }

    void cargarDetalle();
    return () => controlador.abort();
  }, [idAve]);

  return { ave, cargando, error };
}

export { useDetalleAve };
