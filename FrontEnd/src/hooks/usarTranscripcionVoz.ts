import { useCallback, useEffect, useRef, useState } from "react";
import {
  ErrorPermisoDispositivo,
  detenerStream,
  solicitarAccesoDispositivo,
} from "./permisosDispositivo";

type ConfiguracionTranscripcionVoz = {
  alTranscribir: (texto: string) => void | Promise<void>;
  bloqueado?: boolean;
};

function obtenerConstructorReconocimiento() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

function obtenerMensajeError(codigo: string) {
  switch (codigo) {
    case "not-allowed":
    case "service-not-allowed":
      return "El reconocimiento de voz esta bloqueado. Habilita el microfono desde los permisos del sitio.";
    case "audio-capture":
      return "No se encontro un microfono disponible.";
    case "no-speech":
      return "No se detecto voz. Intenta hablar un poco mas cerca.";
    case "network":
      return "No se pudo usar el reconocimiento de voz. Revisa tu conexion.";
    default:
      return "No se pudo reconocer tu voz. Intentalo nuevamente.";
  }
}

function useTranscripcionVoz({
  alTranscribir,
  bloqueado = false,
}: ConfiguracionTranscripcionVoz) {
  const [escuchando, setEscuchando] = useState(false);
  const [solicitandoPermiso, setSolicitandoPermiso] = useState(false);
  const [textoParcial, setTextoParcial] = useState("");
  const [errorVoz, setErrorVoz] = useState("");
  const reconocimientoRef = useRef<ReconocimientoVozNavegador | null>(null);
  const textoFinalRef = useRef("");
  const textoParcialRef = useRef("");
  const huboErrorRef = useRef(false);
  const cancelarEnvioRef = useRef(false);
  const montadoRef = useRef(true);
  const alTranscribirRef = useRef(alTranscribir);
  const solicitudPermisoRef = useRef(0);
  const solicitandoPermisoRef = useRef(false);
  const compatible = obtenerConstructorReconocimiento() !== null;

  useEffect(() => {
    alTranscribirRef.current = alTranscribir;
  }, [alTranscribir]);

  const limpiarSesion = useCallback(() => {
    reconocimientoRef.current = null;
    textoFinalRef.current = "";
    textoParcialRef.current = "";
    if (montadoRef.current) {
      setEscuchando(false);
      setTextoParcial("");
    }
  }, []);

  const cancelar = useCallback(() => {
    cancelarEnvioRef.current = true;
    reconocimientoRef.current?.abort();
    limpiarSesion();
  }, [limpiarSesion]);

  const detener = useCallback(() => {
    reconocimientoRef.current?.stop();
  }, []);

  const iniciar = useCallback(async () => {
    if (
      bloqueado ||
      reconocimientoRef.current ||
      solicitandoPermisoRef.current
    ) {
      return;
    }

    const ConstructorReconocimiento = obtenerConstructorReconocimiento();
    if (!ConstructorReconocimiento) {
      setErrorVoz(
        "Este navegador no admite dictado por voz. Puedes escribir tu pregunta.",
      );
      return;
    }

    const idSolicitud = ++solicitudPermisoRef.current;
    solicitandoPermisoRef.current = true;
    setSolicitandoPermiso(true);
    setErrorVoz("");

    let streamPermiso: MediaStream | null = null;
    try {
      streamPermiso = await solicitarAccesoDispositivo("microfono", {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
        video: false,
      });
      detenerStream(streamPermiso);
      streamPermiso = null;

      if (
        !montadoRef.current ||
        solicitudPermisoRef.current !== idSolicitud
      ) {
        return;
      }

      const reconocimiento = new ConstructorReconocimiento();
      reconocimiento.lang = "es-PE";
      reconocimiento.continuous = false;
      reconocimiento.interimResults = true;
      reconocimiento.maxAlternatives = 1;
      reconocimientoRef.current = reconocimiento;
      textoFinalRef.current = "";
      textoParcialRef.current = "";
      huboErrorRef.current = false;
      cancelarEnvioRef.current = false;

      reconocimiento.onstart = () => {
        if (
          !montadoRef.current ||
          reconocimientoRef.current !== reconocimiento
        ) {
          return;
        }
        setEscuchando(true);
        setTextoParcial("");
      };

      reconocimiento.onresult = (evento) => {
        if (reconocimientoRef.current !== reconocimiento) return;
        let textoFinal = "";
        let textoIntermedio = "";

        for (let indice = 0; indice < evento.results.length; indice += 1) {
          const resultado = evento.results[indice];
          const segmento = resultado?.[0]?.transcript.trim() ?? "";
          if (!segmento) continue;

          if (resultado.isFinal) {
            textoFinal = `${textoFinal} ${segmento}`.trim();
          } else {
            textoIntermedio = `${textoIntermedio} ${segmento}`.trim();
          }
        }

        textoFinalRef.current = textoFinal;
        textoParcialRef.current = `${textoFinal} ${textoIntermedio}`.trim();
        if (montadoRef.current) {
          setTextoParcial(textoParcialRef.current);
        }
      };

      reconocimiento.onerror = (evento) => {
        if (reconocimientoRef.current !== reconocimiento) return;
        huboErrorRef.current = true;
        if (montadoRef.current) {
          setErrorVoz(obtenerMensajeError(evento.error));
        }
      };

      reconocimiento.onend = () => {
        if (reconocimientoRef.current !== reconocimiento) return;
        const textoReconocido = (
          textoFinalRef.current || textoParcialRef.current
        ).trim();
        const debeEnviar =
          !huboErrorRef.current &&
          !cancelarEnvioRef.current &&
          textoReconocido.length > 0;

        limpiarSesion();
        if (debeEnviar) {
          void alTranscribirRef.current(textoReconocido);
        }
      };

      try {
        reconocimiento.start();
      } catch {
        huboErrorRef.current = true;
        setErrorVoz("No se pudo iniciar el microfono. Intentalo nuevamente.");
        limpiarSesion();
      }
    } catch (error) {
      detenerStream(streamPermiso);
      if (
        montadoRef.current &&
        solicitudPermisoRef.current === idSolicitud
      ) {
        setErrorVoz(
          error instanceof ErrorPermisoDispositivo
            ? error.message
            : "No se pudo solicitar el permiso del microfono.",
        );
      }
    } finally {
      if (solicitudPermisoRef.current === idSolicitud) {
        solicitandoPermisoRef.current = false;
        if (montadoRef.current) setSolicitandoPermiso(false);
      }
    }
  }, [bloqueado, limpiarSesion]);

  const alternarGrabacion = useCallback(() => {
    if (reconocimientoRef.current) {
      detener();
      return;
    }
    void iniciar();
  }, [detener, iniciar]);

  const limpiarErrorVoz = useCallback(() => setErrorVoz(""), []);

  useEffect(() => {
    if (!bloqueado) return;
    solicitudPermisoRef.current += 1;
    solicitandoPermisoRef.current = false;
    setSolicitandoPermiso(false);
    if (reconocimientoRef.current) cancelar();
  }, [bloqueado, cancelar]);

  useEffect(() => {
    montadoRef.current = true;
    return () => {
      montadoRef.current = false;
      cancelarEnvioRef.current = true;
      solicitudPermisoRef.current += 1;
      solicitandoPermisoRef.current = false;
      reconocimientoRef.current?.abort();
      reconocimientoRef.current = null;
    };
  }, []);

  return {
    alternarGrabacion,
    compatible,
    detener,
    errorVoz,
    escuchando,
    limpiarErrorVoz,
    solicitandoPermiso,
    textoParcial,
  };
}

export { useTranscripcionVoz };
