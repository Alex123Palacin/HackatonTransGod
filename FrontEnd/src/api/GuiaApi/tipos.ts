type EmisorMensaje = "USUARIO" | "IA";

type MensajeGuiaApi = {
  id_mensaje: number;
  emisor: EmisorMensaje;
  mensaje: string;
  fecha: string;
};

type ConversacionGuiaApi = {
  id_conversacion: number | null;
  titulo: string;
  fecha: string | null;
  mensajes: MensajeGuiaApi[];
};

type DatosMensajeGuia = {
  mensaje: string;
  id_conversacion?: number;
  modo_respuesta?: "corta" | "explicativa";
};

type RespuestaMensajeGuiaApi = {
  id_conversacion: number;
  mensaje_usuario: MensajeGuiaApi;
  mensaje_ia: MensajeGuiaApi;
};

export type {
  ConversacionGuiaApi,
  DatosMensajeGuia,
  EmisorMensaje,
  MensajeGuiaApi,
  RespuestaMensajeGuiaApi,
};
