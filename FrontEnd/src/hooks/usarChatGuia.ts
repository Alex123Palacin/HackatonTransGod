import { useCallback, useEffect, useRef, useState } from "react";
import { enviarMensajeGuia, obtenerConversacionGuia } from "../api/GuiaApi/guiaApi";
import type { MensajeGuiaApi } from "../api/GuiaApi/tipos";
import { ErrorApi } from "../api/LoginApi/clienteApi";
import { haySolicitudDispositivoReciente } from "./permisosDispositivo";

type MensajeChat = Omit<MensajeGuiaApi, "id_mensaje"> & {
  id_mensaje: number | string;
};

function useChatGuia() {
  const [idConversacion, setIdConversacion] = useState<number | null>(null);
  const [mensajes, setMensajes] = useState<MensajeChat[]>([]);
  const [pregunta, setPreguntaEstado] = useState("");
  const [cargando, setCargando] = useState(true);
  const [respondiendo, setRespondiendo] = useState(false);
  const [error, setError] = useState("");
  const [respuestaReciente, setRespuestaReciente] =
    useState<MensajeGuiaApi | null>(null);
  const respondiendoRef = useRef(false);

  const cargarConversacion = useCallback(async (signal?: AbortSignal) => {
    setCargando(true);
    setError("");
    setRespuestaReciente(null);
    try {
      const conversacion = await obtenerConversacionGuia(signal);
      setIdConversacion(conversacion.id_conversacion);
      setMensajes(conversacion.mensajes);
    } catch (errorDesconocido) {
      if (signal?.aborted) return;
      setError(
        errorDesconocido instanceof ErrorApi
          ? errorDesconocido.message
          : "No se pudo cargar la conversacion.",
      );
    } finally {
      if (!signal?.aborted) setCargando(false);
    }
  }, []);

  useEffect(() => {
    let controlador = new AbortController();
    const actualizar = () => {
      if (respondiendoRef.current) return;
      controlador.abort();
      controlador = new AbortController();
      void cargarConversacion(controlador.signal);
    };

    actualizar();
    const actualizarAlVolver = () => {
      if (
        document.visibilityState === "visible" &&
        !haySolicitudDispositivoReciente()
      ) {
        actualizar();
      }
    };
    document.addEventListener("visibilitychange", actualizarAlVolver);
    return () => {
      controlador.abort();
      document.removeEventListener("visibilitychange", actualizarAlVolver);
    };
  }, [cargarConversacion]);

  function setPregunta(valor: string) {
    setPreguntaEstado(valor);
    if (error) setError("");
  }

  async function enviarPregunta(textoDirecto?: string) {
    const texto = (textoDirecto ?? pregunta).trim();
    if (!texto || respondiendoRef.current) return;

    const idTemporal = `temporal-${Date.now()}`;
    setMensajes((actuales) => [
      ...actuales,
      {
        id_mensaje: idTemporal,
        emisor: "USUARIO",
        mensaje: texto,
        fecha: new Date().toISOString(),
      },
    ]);
    if (textoDirecto === undefined) setPreguntaEstado("");
    setError("");
    setRespuestaReciente(null);
    setRespondiendo(true);
    respondiendoRef.current = true;

    try {
      const respuesta = await enviarMensajeGuia({
        mensaje: texto,
        ...(idConversacion ? { id_conversacion: idConversacion } : {}),
      });
      setIdConversacion(respuesta.id_conversacion);
      setMensajes((actuales) => [
        ...actuales.filter((mensaje) => mensaje.id_mensaje !== idTemporal),
        respuesta.mensaje_usuario,
        respuesta.mensaje_ia,
      ]);
      setRespuestaReciente(respuesta.mensaje_ia);
    } catch (errorDesconocido) {
      setError(
        errorDesconocido instanceof ErrorApi
          ? errorDesconocido.message
          : "La guia no pudo responder en este momento.",
      );
      try {
        const conversacion = await obtenerConversacionGuia();
        setIdConversacion(conversacion.id_conversacion);
        setMensajes(conversacion.mensajes);
      } catch {
        // Se conserva el mensaje temporal cuando tampoco se puede recuperar el chat.
      }
    } finally {
      setRespondiendo(false);
      respondiendoRef.current = false;
    }
  }

  return {
    mensajes,
    pregunta,
    setPregunta,
    enviarPregunta,
    cargando,
    respondiendo,
    error,
    respuestaReciente,
  };
}

export { useChatGuia };
export type { MensajeChat };
