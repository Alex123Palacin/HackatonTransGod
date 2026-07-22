import { useCallback, useEffect, useState } from "react";
import {
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
} from "../api/adminmodulos/adminModulosApi";
import type {
  DatosAdmin,
  EstadoReporteAdmin,
  NuevaAveAdmin,
  NuevoComunicadoAdmin,
} from "../api/adminmodulos/tipos";

const DATOS_VACIOS: DatosAdmin = {
  reportes: [],
  comunicados: [],
  aves: [],
  publicaciones: [],
};

function useAdminModulos() {
  const [datos, setDatos] = useState<DatosAdmin>(DATOS_VACIOS);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  const cargar = useCallback(async (mostrarCarga = true) => {
    if (mostrarCarga) setCargando(true);
    setError("");
    try {
      setDatos(await obtenerDatosAdmin());
    } catch (errorDesconocido) {
      setError(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "No se pudo cargar la informacion administrativa.",
      );
    } finally {
      if (mostrarCarga) setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const ejecutar = useCallback(async (operacion: () => Promise<unknown>) => {
    setProcesando(true);
    setError("");
    try {
      await operacion();
      setDatos(await obtenerDatosAdmin());
      return true;
    } catch (errorDesconocido) {
      setError(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "No se pudo completar la operacion.",
      );
      return false;
    } finally {
      setProcesando(false);
    }
  }, []);

  const cambiarEstadoReporte = useCallback(
    (id: number, estado: EstadoReporteAdmin) =>
      ejecutar(() => actualizarReporte(id, estado)),
    [ejecutar],
  );
  const agregarComunicado = useCallback(
    (nuevo: NuevoComunicadoAdmin) => ejecutar(() => crearComunicado(nuevo)),
    [ejecutar],
  );
  const actualizarComunicado = useCallback(
    (id: number, comunicado: NuevoComunicadoAdmin) =>
      ejecutar(() => editarComunicado(id, comunicado)),
    [ejecutar],
  );
  const agregarAve = useCallback(
    (nueva: NuevaAveAdmin) => ejecutar(() => crearAve(nueva)),
    [ejecutar],
  );
  const actualizarAve = useCallback(
    (id: number, ave: NuevaAveAdmin) => ejecutar(() => editarAve(id, ave)),
    [ejecutar],
  );

  return {
    datos,
    cargando,
    procesando,
    error,
    recargar: () => cargar(false),
    limpiarError: () => setError(""),
    cambiarEstadoReporte,
    borrarReporte: (id: number) => ejecutar(() => eliminarReporte(id)),
    agregarComunicado,
    actualizarComunicado,
    agregarAve,
    actualizarAve,
    alternarEstadoComunicado: (id: number) => {
      const comunicado = datos.comunicados.find((item) => item.id === id);
      return comunicado
        ? ejecutar(() => cambiarVisibilidadComunicado(id, !comunicado.activo))
        : Promise.resolve(false);
    },
    alternarEstadoAve: (id: number) => {
      const ave = datos.aves.find((item) => item.id === id);
      return ave
        ? ejecutar(() => cambiarVisibilidadAve(id, !ave.activa))
        : Promise.resolve(false);
    },
    alternarEstadoPublicacion: (id: number) => {
      const publicacion = datos.publicaciones.find((item) => item.id === id);
      return publicacion
        ? ejecutar(() =>
            cambiarVisibilidadPublicacion(id, !publicacion.activa),
          )
        : Promise.resolve(false);
    },
    borrarComunicado: (id: number) => ejecutar(() => eliminarComunicado(id)),
    borrarAve: (id: number) => ejecutar(() => eliminarAve(id)),
    borrarPublicacion: (id: number) =>
      ejecutar(() => eliminarPublicacion(id)),
  };
}

export { useAdminModulos };
