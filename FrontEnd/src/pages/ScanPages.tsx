import { useEffect, useRef, useState } from "react";
import {
  FaBolt,
  FaImage,
  FaMobileAlt,
  FaRedoAlt,
  FaTimes,
} from "react-icons/fa";
import AdaptadoMobil from "../components/AdaptadoMobil";
import MenuModulosComp from "../components/MenuModulosComp";
import { useRedireccion } from "../hooks/redireccion";

function esDispositivoMobil() {
  if (typeof navigator === "undefined") return false;

  const porUsuario = /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
  const porPantalla =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches &&
    window.innerWidth <= 768;

  return porUsuario || porPantalla;
}

function ScanPages() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [esMobil, setEsMobil] = useState(false);
  const [mensajeCamara, setMensajeCamara] = useState("");
  const { redirigir } = useRedireccion();

  useEffect(() => {
    const dispositivoMobil = esDispositivoMobil();
    setEsMobil(dispositivoMobil);

    if (!dispositivoMobil) return;

    let streamActivo: MediaStream | null = null;

    async function iniciarCamara() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
          },
          audio: false,
        });

        streamActivo = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setMensajeCamara(
          "No se pudo abrir la camara trasera. Revisa los permisos del navegador.",
        );
      }
    }

    iniciarCamara();

    return () => {
      streamActivo?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <AdaptadoMobil>
      <section className="relative flex min-h-screen flex-col overflow-hidden bg-[#10282b] [overflow-wrap:normal] [word-break:normal]">
        {!esMobil ? (
          <main className="flex flex-1 flex-col items-center justify-center gap-4 bg-[#dbeee8] px-8 text-center">
            <FaMobileAlt className="h-16 w-16 text-red-600" />
            <h1 className="text-[22px] font-bold text-[#006f6c]">
              Utilice un celular
            </h1>
            <p className="max-w-[280px] text-[13px] leading-5 text-slate-600">
              El escaner necesita la camara trasera para identificar aves. En PC
              esta pantalla solo muestra este aviso.
            </p>
          </main>
        ) : (
          <main className="relative flex flex-1 overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/20" />

            <header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 pt-5">
              <button
                type="button"
                onClick={() => redirigir("/Inicio")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-black/20 text-white"
              >
                <FaTimes />
              </button>

              <span className="rounded-full bg-[#006f6c] px-5 py-2 text-[12px] font-bold text-white shadow-md">
                Escanea un ave
              </span>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-black/20 text-white"
              >
                <FaBolt />
              </button>
            </header>

            <div className="absolute left-8 right-8 top-[130px] z-10 h-[260px]">
              <span className="absolute left-0 top-0 h-14 w-14 rounded-tl-lg border-l-4 border-t-4 border-white" />
              <span className="absolute right-0 top-0 h-14 w-14 rounded-tr-lg border-r-4 border-t-4 border-white" />
              <span className="absolute bottom-0 left-0 h-14 w-14 rounded-bl-lg border-b-4 border-l-4 border-white" />
              <span className="absolute bottom-0 right-0 h-14 w-14 rounded-br-lg border-b-4 border-r-4 border-white" />
            </div>

            <div className="absolute bottom-[118px] left-5 right-5 z-10 rounded-2xl border border-white/50 bg-black/25 px-5 py-4 text-center text-[13px] font-bold leading-5 text-white backdrop-blur-sm">
              {mensajeCamara || "Toma una foto clara del ave para identificarla o registrarla."}
            </div>

            <footer className="absolute bottom-[58px] left-0 right-0 z-10 flex items-center justify-between px-8">
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/50 bg-black/25 text-white backdrop-blur-sm"
              >
                <FaImage className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => redirigir("/scan/detalle")}
                className="h-[72px] w-[72px] rounded-full border-[6px] border-white bg-white/80 shadow-lg ring-4 ring-black/30"
                aria-label="Tomar foto"
              />

              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/50 bg-black/25 text-white backdrop-blur-sm"
              >
                <FaRedoAlt className="h-5 w-5" />
              </button>
            </footer>
          </main>
        )}

        <MenuModulosComp />
      </section>
    </AdaptadoMobil>
  );
}

export default ScanPages;
