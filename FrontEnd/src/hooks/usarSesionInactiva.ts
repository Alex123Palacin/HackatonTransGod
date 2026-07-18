import { useEffect, useState } from "react";
import { registrarActividadSesion } from "../api/LoginApi/authApi";
import { ErrorApi } from "../api/LoginApi/clienteApi";
import {
  limpiarSesion,
  marcarUltimaActividad,
  obtenerSesion,
  obtenerUltimaActividad,
} from "../api/LoginApi/authStorage";

const MINUTOS_INACTIVIDAD = Number(
  import.meta.env.VITE_SESION_INACTIVIDAD_MINUTOS || 30,
);
const LIMITE_INACTIVIDAD = MINUTOS_INACTIVIDAD * 60 * 1000;
const INTERVALO_COMPROBACION = 30 * 1000;
const INTERVALO_PING = 5 * 60 * 1000;
const INTERVALO_GUARDADO = 15 * 1000;

function useSesionInactiva() {
  const [sesionVencida, setSesionVencida] = useState(false);

  useEffect(() => {
    if (!obtenerSesion()) return;

    let ultimaActividad = obtenerUltimaActividad();
    let ultimoGuardado = ultimaActividad;
    let ultimoPing = Date.now();
    let pingEnCurso = false;

    function vencerSesion() {
      limpiarSesion();
      setSesionVencida(true);
    }

    function comprobarInactividad() {
      if (Date.now() - ultimaActividad < LIMITE_INACTIVIDAD) return false;
      vencerSesion();
      return true;
    }

    async function enviarActividad() {
      if (pingEnCurso) return;
      pingEnCurso = true;
      try {
        await registrarActividadSesion();
      } catch (error) {
        if (error instanceof ErrorApi && error.status === 401) vencerSesion();
      } finally {
        pingEnCurso = false;
      }
    }

    function registrarInteraccion() {
      if (comprobarInactividad()) return;

      const ahora = Date.now();
      ultimaActividad = ahora;
      if (ahora - ultimoGuardado >= INTERVALO_GUARDADO) {
        marcarUltimaActividad(ahora);
        ultimoGuardado = ahora;
      }
      if (ahora - ultimoPing >= INTERVALO_PING) {
        ultimoPing = ahora;
        void enviarActividad();
      }
    }

    function comprobarVisibilidad() {
      if (document.visibilityState !== "visible") return;
      registrarInteraccion();
    }

    const eventos: (keyof WindowEventMap)[] = [
      "pointerdown",
      "keydown",
      "touchstart",
      "scroll",
    ];
    eventos.forEach((evento) =>
      window.addEventListener(evento, registrarInteraccion, { passive: true }),
    );
    document.addEventListener("visibilitychange", comprobarVisibilidad);
    const intervalo = window.setInterval(
      comprobarInactividad,
      INTERVALO_COMPROBACION,
    );

    comprobarInactividad();

    return () => {
      eventos.forEach((evento) =>
        window.removeEventListener(evento, registrarInteraccion),
      );
      document.removeEventListener("visibilitychange", comprobarVisibilidad);
      window.clearInterval(intervalo);
    };
  }, []);

  return sesionVencida;
}

export { useSesionInactiva };
