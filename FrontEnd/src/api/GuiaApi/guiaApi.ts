import { peticionAutenticada } from "../LoginApi/clienteApi";
import type {
  ConversacionGuiaApi,
  DatosMensajeGuia,
  RespuestaMensajeGuiaApi,
} from "./tipos";

function obtenerConversacionGuia(signal?: AbortSignal) {
  return peticionAutenticada<ConversacionGuiaApi>("/guia/conversacion/", {
    signal,
  });
}

function enviarMensajeGuia(datos: DatosMensajeGuia) {
  return peticionAutenticada<RespuestaMensajeGuiaApi>("/guia/mensajes/", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export { enviarMensajeGuia, obtenerConversacionGuia };
