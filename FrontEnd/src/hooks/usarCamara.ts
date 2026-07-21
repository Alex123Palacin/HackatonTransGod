import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import {
  ErrorPermisoDispositivo,
  detenerStream,
  solicitarAccesoDispositivo,
} from "./permisosDispositivo";

type ModoCamara = "environment" | "user";
type EstadoCamara = "inactiva" | "solicitando" | "activa" | "error";

function useCamara(videoRef: RefObject<HTMLVideoElement | null>) {
  const [modoCamara, setModoCamara] = useState<ModoCamara>("environment");
  const [estadoCamara, setEstadoCamara] =
    useState<EstadoCamara>("inactiva");
  const [errorCamara, setErrorCamara] = useState("");
  const streamRef = useRef<MediaStream | null>(null);
  const solicitudRef = useRef(0);
  const solicitandoRef = useRef(false);
  const montadoRef = useRef(true);
  const modoRef = useRef<ModoCamara>("environment");

  const liberarCamara = useCallback(() => {
    const stream = streamRef.current;
    streamRef.current = null;
    stream?.getTracks().forEach((pista) => {
      pista.onended = null;
    });
    detenerStream(stream);
    if (videoRef.current) videoRef.current.srcObject = null;
  }, [videoRef]);

  const iniciarCamara = useCallback(
    async (modoSolicitado: ModoCamara = modoRef.current) => {
      if (solicitandoRef.current) return;

      const idSolicitud = ++solicitudRef.current;
      solicitandoRef.current = true;
      setEstadoCamara("solicitando");
      setErrorCamara("");
      liberarCamara();

      let nuevoStream: MediaStream | null = null;
      try {
        nuevoStream = await solicitarAccesoDispositivo("camara", {
          audio: false,
          video: {
            facingMode: { ideal: modoSolicitado },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (!montadoRef.current || solicitudRef.current !== idSolicitud) {
          detenerStream(nuevoStream);
          return;
        }

        const video = videoRef.current;
        if (!video) {
          detenerStream(nuevoStream);
          throw new Error("No se encontro el visor de la camara.");
        }

        streamRef.current = nuevoStream;
        video.srcObject = nuevoStream;
        await video.play();

        if (!montadoRef.current || solicitudRef.current !== idSolicitud) {
          liberarCamara();
          return;
        }

        const pistaVideo = nuevoStream.getVideoTracks()[0];
        if (pistaVideo) {
          pistaVideo.onended = () => {
            if (!montadoRef.current || streamRef.current !== nuevoStream) return;
            streamRef.current = null;
            setEstadoCamara("inactiva");
            setErrorCamara("La camara se detuvo. Activa el acceso nuevamente.");
          };
        }

        modoRef.current = modoSolicitado;
        setModoCamara(modoSolicitado);
        setEstadoCamara("activa");
      } catch (error) {
        if (streamRef.current === nuevoStream) {
          liberarCamara();
        } else {
          detenerStream(nuevoStream);
        }
        if (!montadoRef.current || solicitudRef.current !== idSolicitud) return;
        setEstadoCamara("error");
        setErrorCamara(
          error instanceof ErrorPermisoDispositivo
            ? error.message
            : "No se pudo iniciar la camara. Intentalo nuevamente.",
        );
      } finally {
        if (solicitudRef.current === idSolicitud) {
          solicitandoRef.current = false;
        }
      }
    },
    [liberarCamara, videoRef],
  );

  const cambiarCamara = useCallback(() => {
    const nuevoModo = modoRef.current === "environment" ? "user" : "environment";
    void iniciarCamara(nuevoModo);
  }, [iniciarCamara]);

  const detenerCamara = useCallback(() => {
    solicitudRef.current += 1;
    solicitandoRef.current = false;
    liberarCamara();
    setEstadoCamara("inactiva");
  }, [liberarCamara]);

  useEffect(() => {
    montadoRef.current = true;
    return () => {
      montadoRef.current = false;
      solicitudRef.current += 1;
      solicitandoRef.current = false;
      liberarCamara();
    };
  }, [liberarCamara]);

  return {
    cambiarCamara,
    camaraActiva: estadoCamara === "activa",
    cargandoCamara: estadoCamara === "solicitando",
    detenerCamara,
    errorCamara,
    iniciarCamara,
    modoCamara,
  };
}

export { useCamara };
export type { ModoCamara };
