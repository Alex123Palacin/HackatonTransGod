import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaMagic,
  FaMicrophone,
  FaPaperPlane,
  FaVolumeUp,
} from "react-icons/fa";
import AdaptadoMobil from "../components/AdaptadoMobil";
import IndicadorEscribiendoComp from "../components/IndicadorEscribiendoComp";
import MensajeIaComp from "../components/MensajeIaComp";
import MensajeUsuarioComp from "../components/MensajeUsuarioComp";
import MenuModulosComp from "../components/MenuModulosComp";
import MenuPerfilComp from "../components/MenuPerfilComp";
import { useChatGuia } from "../hooks/usarChatGuia";
import { useTextoAVoz } from "../hooks/usarTextoAVoz";
import { useTranscripcionVoz } from "../hooks/usarTranscripcionVoz";
import { FlechitaRetrocede } from "../ui/BotonUi";

function GuiaPages() {
  const [sonidoActivo, setSonidoActivo] = useState(true);
  const finConversacionRef = useRef<HTMLDivElement | null>(null);
  const ultimaRespuestaLeidaRef = useRef<number | null>(null);
  const {
    mensajes,
    pregunta,
    setPregunta,
    enviarPregunta,
    cargando,
    respondiendo,
    error,
    respuestaReciente,
  } = useChatGuia();
  const {
    detener: detenerLectura,
    hablando,
    hablar,
  } = useTextoAVoz(sonidoActivo);
  const enviarPreguntaPorVoz = useCallback(
    (texto: string) => enviarPregunta(texto),
    [enviarPregunta],
  );
  const {
    alternarGrabacion,
    errorVoz,
    escuchando,
    limpiarErrorVoz,
    solicitandoPermiso,
    textoParcial,
  } = useTranscripcionVoz({
    alTranscribir: enviarPreguntaPorVoz,
    bloqueado: cargando || respondiendo,
  });

  useEffect(() => {
    finConversacionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [mensajes, respondiendo]);

  useEffect(() => {
    if (
      !respuestaReciente ||
      ultimaRespuestaLeidaRef.current === respuestaReciente.id_mensaje
    ) {
      return;
    }
    ultimaRespuestaLeidaRef.current = respuestaReciente.id_mensaje;
    hablar(respuestaReciente.mensaje);
  }, [hablar, respuestaReciente]);

  return (
    <AdaptadoMobil>
      <section className="flex h-full min-h-0 flex-col bg-white [overflow-wrap:normal] [word-break:normal]">
        <header className="flex shrink-0 items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <FlechitaRetrocede ruta="/Inicio" estilos="!shadow-sm" />
            <FaMagic className="h-5 w-5 text-[#006f6c]" />
            <div>
              <h1 className="text-[17px] font-bold leading-5 text-[#0b4f50]">
                Asistente IA
              </h1>
              <p className="text-[11px] font-bold text-slate-500">
                Tu guia del humedal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (sonidoActivo) detenerLectura();
                setSonidoActivo((activo) => !activo);
              }}
              className={`relative flex h-9 w-9 items-center justify-center rounded-full bg-[#edf5f2] text-[#006f6c] ${
                hablando ? "animate-pulse" : ""
              }`}
              aria-label={sonidoActivo ? "Desactivar sonido" : "Activar sonido"}
              aria-pressed={sonidoActivo}
            >
              <FaVolumeUp className="h-4 w-4" />
              {!sonidoActivo && (
                <span className="absolute h-[2px] w-6 rotate-45 rounded-full bg-[#006f6c]" />
              )}
            </button>
            <MenuPerfilComp />
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col px-4 pb-3">
          <section
            aria-live="polite"
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1 py-2"
          >
            {cargando && (
              <div className="flex flex-1 items-center justify-center">
                <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#dbeee8] border-t-[#006f6c]" />
              </div>
            )}

            {!cargando && mensajes.length === 0 && !error && (
              <div className="flex flex-1 items-center justify-center">
                <FaMagic className="h-8 w-8 text-[#9fc8c0]" />
              </div>
            )}

            {!cargando &&
              mensajes.map((mensaje) =>
                mensaje.emisor === "USUARIO" ? (
                  <MensajeUsuarioComp
                    key={mensaje.id_mensaje}
                    mensaje={mensaje.mensaje}
                    fecha={mensaje.fecha}
                  />
                ) : (
                  <MensajeIaComp
                    key={mensaje.id_mensaje}
                    mensaje={mensaje.mensaje}
                    fecha={mensaje.fecha}
                  />
                ),
              )}

            {respondiendo && <IndicadorEscribiendoComp />}

            {(error || errorVoz) && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-3 py-2 text-center text-[11px] text-red-600"
              >
                {error || errorVoz}
              </p>
            )}
            <div ref={finConversacionRef} />
          </section>

          <button
            type="button"
            onClick={() => {
              detenerLectura();
              alternarGrabacion();
            }}
            disabled={cargando || respondiendo || solicitandoPermiso}
            className="mt-2 flex w-full shrink-0 flex-col items-center gap-1 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={escuchando ? "Detener grabacion" : "Grabar pregunta"}
            aria-pressed={escuchando}
          >
            <span className="flex w-full items-center justify-center gap-2 rounded-full bg-[#f4f8f6] px-3 py-2">
              <span className="h-7 flex-1 rounded-full bg-[repeating-linear-gradient(90deg,#cfe4df_0_3px,transparent_3px_9px)]" />
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-[#006f6c] text-white shadow-lg transition ${
                  escuchando ? "scale-105 animate-pulse" : ""
                }`}
              >
                <FaMicrophone className="h-7 w-7" />
              </span>
              <span className="h-7 flex-1 rounded-full bg-[repeating-linear-gradient(90deg,#cfe4df_0_3px,transparent_3px_9px)]" />
            </span>
            <span className="max-w-full truncate px-3 text-[10px] font-bold text-[#006f6c]">
              {solicitandoPermiso
                ? "Solicitando permiso..."
                : escuchando
                  ? textoParcial || "Escuchando..."
                  : "Toca para hablar"}
            </span>
          </button>

          <form
            className="mt-2 flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm"
            onSubmit={(event) => {
              event.preventDefault();
              limpiarErrorVoz();
              void enviarPregunta();
            }}
          >
            <input
              type="text"
              value={pregunta}
              maxLength={2000}
              disabled={cargando || respondiendo}
              onChange={(event) => {
                limpiarErrorVoz();
                setPregunta(event.target.value);
              }}
              placeholder="Escribe tu pregunta..."
              className="min-w-0 flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={cargando || respondiendo || !pregunta.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#006f6c] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Enviar pregunta"
            >
              <FaPaperPlane className="h-5 w-5" />
            </button>
          </form>
        </main>

        <MenuModulosComp />
      </section>
    </AdaptadoMobil>
  );
}

export default GuiaPages;
