import { useState } from "react";
import {
  FaMagic,
  FaMicrophone,
  FaPaperPlane,
  FaVolumeUp,
} from "react-icons/fa";
import AdaptadoMobil from "../components/AdaptadoMobil";
import MenuModulosComp from "../components/MenuModulosComp";
import { FlechitaRetrocede } from "../ui/BotonUi";

function GuiaPages() {
  const [grabando, setGrabando] = useState(false);
  const [sonidoActivo, setSonidoActivo] = useState(true);

  return (
    <AdaptadoMobil>
      <section className="flex min-h-screen flex-col bg-white [overflow-wrap:normal] [word-break:normal]">
        <header className="flex items-center justify-between px-4 py-4">
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

          <button
            type="button"
            onClick={() => setSonidoActivo((activo) => !activo)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#edf5f2] text-[#006f6c]"
            aria-label="Activar sonido"
          >
            <FaVolumeUp className="h-4 w-4" />
            {!sonidoActivo && (
              <span className="absolute h-[2px] w-6 rotate-45 rounded-full bg-[#006f6c]" />
            )}
          </button>
        </header>

        <main className="flex flex-1 flex-col gap-4 px-5 pb-4">
          <div className="ml-auto max-w-[255px] rounded-2xl rounded-tr-sm bg-[#dbeee8] px-4 py-3 text-[13px] leading-5 text-[#0b4f50] shadow-sm">
            <p>Sabes cuando sale el GTA 6?</p>
            <span className="mt-2 block text-right text-[10px] text-slate-500">
              9:41
            </span>
          </div>

          <div className="max-w-[285px] rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-4 py-3 text-[13px] leading-5 text-slate-700 shadow-md">
            <p>
              El 19 de noviembre. Por ahora este mensaje es solo de prueba para
              ver como se vera la respuesta del asistente IA.
            </p>
            <span className="mt-2 block text-right text-[10px] text-slate-500">
              9:41
            </span>
          </div>

          <div className="ml-auto max-w-[210px] rounded-2xl rounded-tr-sm bg-[#dbeee8] px-4 py-3 text-[13px] leading-5 text-[#0b4f50] shadow-sm">
            <p>Genial, gracias.</p>
            <span className="mt-2 block text-right text-[10px] text-slate-500">
              9:42
            </span>
          </div>

          <div className="mt-auto flex flex-col items-center gap-2">
            <div className="flex w-full items-center justify-center gap-2 rounded-full bg-[#f4f8f6] px-3 py-3">
              <span className="h-8 flex-1 rounded-full bg-[repeating-linear-gradient(90deg,#cfe4df_0_3px,transparent_3px_9px)]" />
              <button
                type="button"
                onClick={() => setGrabando((activo) => !activo)}
                className={`flex h-[76px] w-[76px] items-center justify-center rounded-full border-4 border-white bg-[#006f6c] text-white shadow-lg transition ${
                  grabando ? "scale-105 animate-pulse" : ""
                }`}
                aria-label="Grabar voz"
              >
                <FaMicrophone className="h-8 w-8" />
              </button>
              <span className="h-8 flex-1 rounded-full bg-[repeating-linear-gradient(90deg,#cfe4df_0_3px,transparent_3px_9px)]" />
            </div>
            <p className="text-[11px] font-bold text-[#006f6c]">
              {grabando ? "Grabando..." : "Toca para hablar"}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3 shadow-sm">
            <input
              type="text"
              placeholder="Escribe tu pregunta..."
              className="min-w-0 flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400"
            />
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#006f6c]"
              aria-label="Enviar pregunta"
            >
              <FaPaperPlane className="h-5 w-5" />
            </button>
          </div>
        </main>

        <MenuModulosComp />
      </section>
    </AdaptadoMobil>
  );
}

export default GuiaPages;
