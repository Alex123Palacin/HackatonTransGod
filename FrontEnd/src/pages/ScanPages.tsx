import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { FaBolt, FaCamera, FaImage, FaRedoAlt, FaTimes } from "react-icons/fa";
import AdaptadoMobil from "../components/AdaptadoMobil";
import MenuModulosComp from "../components/MenuModulosComp";
import MenuPerfilComp from "../components/MenuPerfilComp";
import { useCamara } from "../hooks/usarCamara";
import { useRedireccion } from "../hooks/redireccion";

function ScanPages() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [flashActivo, setFlashActivo] = useState(false);
  const [efectoFlash, setEfectoFlash] = useState(false);
  const { redirigir } = useRedireccion();
  const {
    cambiarCamara,
    camaraActiva,
    cargandoCamara,
    errorCamara,
    iniciarCamara,
    modoCamara,
  } = useCamara(videoRef);

  const abrirGaleria = () => fileInputRef.current?.click();

  const guardarImagen = (imagen: string) => {
    localStorage.setItem("fotoCapturadaAve", imagen);
    redirigir("/scan/detalle");
  };

  const manejarSeleccionImagen = (evento: ChangeEvent<HTMLInputElement>) => {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = () => {
      const imagen = new Image();
      imagen.onload = () => {
        const canvas = document.createElement("canvas");
        const anchoMaximo = 900;
        const escala = Math.min(1, anchoMaximo / imagen.width);
        canvas.width = Math.round(imagen.width * escala);
        canvas.height = Math.round(imagen.height * escala);
        canvas.getContext("2d")?.drawImage(imagen, 0, 0, canvas.width, canvas.height);
        guardarImagen(canvas.toDataURL("image/jpeg", 0.75));
      };
      imagen.src = String(lector.result);
    };
    lector.readAsDataURL(archivo);
    evento.target.value = "";
  };

  const tomarFoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !camaraActiva || video.readyState < 2) return;

    if (flashActivo) {
      setEfectoFlash(true);
      window.setTimeout(() => setEfectoFlash(false), 150);
    }

    const anchoMaximo = 900;
    const escala = Math.min(1, anchoMaximo / video.videoWidth);
    canvas.width = Math.round(video.videoWidth * escala);
    canvas.height = Math.round(video.videoHeight * escala);
    const contexto = canvas.getContext("2d");
    if (!contexto) return;

    if (modoCamara === "user") {
      contexto.translate(canvas.width, 0);
      contexto.scale(-1, 1);
    }
    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);
    guardarImagen(canvas.toDataURL("image/jpeg", 0.75));
  };

  return (
    <AdaptadoMobil>
      <section className="relative flex h-full w-full flex-col overflow-hidden bg-[#10282b]">
        <canvas ref={canvasRef} className="hidden" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={manejarSeleccionImagen}
        />

        {efectoFlash && (
          <div className="absolute inset-0 z-50 bg-white transition-opacity duration-75" />
        )}

        <main className="relative min-h-0 w-full flex-1 overflow-hidden bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 h-full w-full object-cover ${
              modoCamara === "user" ? "scale-x-[-1]" : ""
            }`}
          />
          <div className="pointer-events-none absolute inset-0 bg-black/20" />

          {!camaraActiva && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[#10282b] px-8 text-center text-white">
              {cargandoCamara ? (
                <span className="h-9 w-9 animate-spin rounded-full border-4 border-white border-t-transparent" />
              ) : (
                <FaCamera className="h-12 w-12 text-[#9fd8ce]" />
              )}
              <div className="max-w-[290px]">
                <h1 className="text-[18px] font-bold">Acceso a la camara</h1>
                <p
                  className={`mt-2 text-[12px] leading-5 ${
                    errorCamara ? "text-red-300" : "text-slate-200"
                  }`}
                >
                  {errorCamara ||
                    "Activa la camara y acepta el permiso del navegador para escanear un ave."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void iniciarCamara()}
                disabled={cargandoCamara}
                className="min-h-10 w-full max-w-[220px] rounded-full bg-[#007d78] px-5 py-2 text-[13px] font-bold text-white disabled:opacity-60"
              >
                {cargandoCamara ? "Solicitando permiso..." : "Activar camara"}
              </button>
            </div>
          )}

          <header className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-4 pt-5">
            <button
              type="button"
              onClick={() => redirigir("/Inicio")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-black/30 text-white"
              aria-label="Cerrar escaner"
            >
              <FaTimes />
            </button>
            <span className="rounded-full bg-[#006f6c] px-5 py-2 text-[12px] font-bold text-white shadow-md">
              Escanea un ave
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFlashActivo((activo) => !activo)}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                  flashActivo
                    ? "border-yellow-500 bg-yellow-400 text-black"
                    : "border-white/60 bg-black/30 text-white"
                }`}
                aria-label={flashActivo ? "Desactivar flash" : "Activar flash"}
                aria-pressed={flashActivo}
              >
                <FaBolt />
              </button>
              <MenuPerfilComp />
            </div>
          </header>

          {camaraActiva && (
            <div className="absolute bottom-[130px] left-5 right-5 z-10 mx-auto max-w-md rounded-2xl border border-white/50 bg-black/40 px-5 py-4 text-center text-[13px] font-bold leading-5 text-white backdrop-blur-sm">
              {flashActivo ? "Flash de pantalla listo." : "Toma una foto clara del ave."}
            </div>
          )}

          <footer className="absolute bottom-6 left-0 right-0 z-30 mx-auto flex max-w-md items-center justify-between px-8">
            <button
              type="button"
              onClick={abrirGaleria}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/50 bg-black/35 text-white backdrop-blur-sm"
              aria-label="Elegir imagen de la galeria"
            >
              <FaImage className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={tomarFoto}
              disabled={!camaraActiva}
              className="h-[72px] w-[72px] rounded-full border-[6px] border-white bg-white/80 shadow-lg ring-4 ring-black/30 transition-transform active:scale-90 disabled:opacity-40"
              aria-label="Tomar foto"
            />
            <button
              type="button"
              onClick={cambiarCamara}
              disabled={!camaraActiva || cargandoCamara}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/50 bg-black/35 text-white backdrop-blur-sm disabled:opacity-40"
              aria-label="Cambiar camara"
            >
              <FaRedoAlt className="h-5 w-5" />
            </button>
          </footer>
        </main>

        <MenuModulosComp />
      </section>
    </AdaptadoMobil>
  );
}

export default ScanPages;
