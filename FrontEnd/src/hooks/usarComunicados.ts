import { useCallback, useEffect, useState } from "react";
import { listarComunicados } from "../api/NoticiaApi/ComunicadoApi/comunicadoApi";
import type { ComunicadoApi } from "../api/NoticiaApi/ComunicadoApi/tipos";
import { ErrorApi } from "../api/LoginApi/clienteApi";

type ComunicadoVista = {
  id: number;
  categoria: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  imagenUrl?: string;
};

const formateadorFecha = new Intl.DateTimeFormat("es-PE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function adaptarComunicado(comunicado: ComunicadoApi): ComunicadoVista {
  return {
    id: comunicado.id_comunicado,
    categoria: "Comunicado",
    titulo: comunicado.titulo,
    descripcion: comunicado.descripcion,
    fecha: formateadorFecha.format(new Date(`${comunicado.fecha}T00:00:00`)),
    imagenUrl: comunicado.imagen ?? undefined,
  };
}

function useComunicados() {
  const [comunicados, setComunicados] = useState<ComunicadoVista[]>([]);
  const [comunicadoSeleccionado, setComunicadoSeleccionado] =
    useState<ComunicadoVista | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarComunicados = useCallback(async (signal?: AbortSignal) => {
    setCargando(true);
    setError("");

    try {
      const respuesta = await listarComunicados(signal);
      setComunicados(respuesta.map(adaptarComunicado));
    } catch (errorDesconocido) {
      if (signal?.aborted) return;
      setError(
        errorDesconocido instanceof ErrorApi
          ? errorDesconocido.message
          : "No se pudieron cargar los comunicados.",
      );
    } finally {
      if (!signal?.aborted) setCargando(false);
    }
  }, []);

  useEffect(() => {
    const controlador = new AbortController();
    void cargarComunicados(controlador.signal);
    return () => controlador.abort();
  }, [cargarComunicados]);

  return {
    comunicados,
    comunicadoSeleccionado,
    cargando,
    error,
    cargarComunicados,
    abrirComunicado: setComunicadoSeleccionado,
    cerrarComunicado: () => setComunicadoSeleccionado(null),
  };
}

export { useComunicados };
export type { ComunicadoVista };
