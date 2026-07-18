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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [esMobil, setEsMobil] = useState(false);
  const [cargandoCamara, setCargandoCamara] = useState(true);
  
  const [modoCamara, setModoCamara] = useState<"environment" | "user">("environment");
  const [flashActivo, setFlashActivo] = useState(false);
  const [efectoFlash, setEfectoFlash] = useState(false);

  const { redirigir } = useRedireccion();

  const iniciarCamara = async (facingModeActual: "environment" | "user", streamPrevio: MediaStream | null) => {
    try {
      setCargandoCamara(true);
      
      if (streamPrevio) {
        streamPrevio.getTracks().forEach((track) => track.stop());
      }

      const opcionesVideo = {
        video: {
          facingMode: facingModeActual
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(opcionesVideo);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
          setCargandoCamara(false);
        };
      }
      return stream;
    } catch {
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.play().catch(() => {});
        }
        setCargandoCamara(false);
        return fallbackStream;
      } catch {
        setCargandoCamara(false);
        return null;
      }
    }
  };

  useEffect(() => {
    const dispositivoMobil = esDispositivoMobil();
    setEsMobil(dispositivoMobil);

    if (!dispositivoMobil) {
      setCargandoCamara(false);
      return;
    }

    let streamActivo: MediaStream | null = null;

    async function arrancar() {
      streamActivo = await iniciarCamara(modoCamara, null);
    }
    arrancar();

    const manejarCambioVisibilidad = async () => {
      if (document.visibilityState === "visible") {
        streamActivo = await iniciarCamara(modoCamara, streamActivo);
      }
    };

    document.addEventListener("visibilitychange", manejarCambioVisibilidad);

    return () => {
      document.removeEventListener("visibilitychange", manejarCambioVisibilidad);
      if (streamActivo) {
        streamActivo.getTracks().forEach((track) => track.stop());
      }
    };
  }, [modoCamara]);

  const cambiarCamara = () => {
    setModoCamara((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const abrirGaleria = () => {
    fileInputRef.current?.click();
  };

  const manejarSeleccionImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) {
      const lector = new FileReader();
      lector.onload = (evento) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 500;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const optimizada = canvas.toDataURL("image/jpeg", 0.6);
          localStorage.setItem("fotoCapturadaAve", optimizada);
          redirigir("/scan/detalle");
        };
        img.src = evento.target?.result as string;
      };
      lector.readAsDataURL(archivo);
    }
  };

  const tomarFoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    if (flashActivo) {
      setEfectoFlash(true);
      setTimeout(() => setEfectoFlash(false), 150);
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      canvas.width = 500;
      canvas.height = 375;
      
      if (modoCamara === "user") {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const fotoBase64 = canvas.toDataURL("image/jpeg", 0.6);
      localStorage.setItem("fotoCapturadaAve", fotoBase64);
      
      redirigir("/scan/detalle");
    }
  };

  return (
    <AdaptadoMobil>
      <section className="relative flex h-screen w-full flex-col overflow-hidden bg-[#10282b]">
        <canvas ref={canvasRef} className="hidden" />
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={manejarSeleccionImagen} />

        {efectoFlash && <div className="absolute inset-0 z-50 bg-white transition-opacity duration-75" />}

        {!esMobil ? (
          <main className="flex flex-1 flex-col items-center justify-center gap-4 bg-[#dbeee8] px-8 text-center">
            <FaMobileAlt className="h-16 w-16 text-red-600" />
            <h1 className="text-[22px] font-bold text-[#006f6c]">Utilice un celular</h1>
            <p className="max-w-[280px] text-[13px] leading-5 text-slate-600">
              El escáner necesita la cámara para identificar aves.
            </p>
          </main>
        ) : (
          <main className="relative flex-1 w-full h-full overflow-hidden bg-black">
            <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 h-full w-full object-cover ${modoCamara === 'user' ? 'scale-x-[-1]' : ''}`} />
            <div className="absolute inset-0 bg-black/20" />

            {cargandoCamara && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#10282b]/90 text-white">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                <p className="mt-3 text-sm text-emerald-200">Abriendo cámara...</p>
              </div>
            )}

            <header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 pt-5">
              <button type="button" onClick={() => redirigir("/Inicio")} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-black/20 text-white"><FaTimes /></button>
              <span className="rounded-full bg-[#006f6c] px-5 py-2 text-[12px] font-bold text-white shadow-md">Escanea un ave</span>
              <button type="button" onClick={() => setFlashActivo(!flashActivo)} className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${flashActivo ? "bg-yellow-400 border-yellow-500 text-black" : "bg-black/20 border-white/60 text-white"}`}><FaBolt /></button>
            </header>

            <div className="absolute bottom-[130px] left-5 right-5 z-10 rounded-2xl border border-white/50 bg-black/40 px-5 py-4 text-center text-[13px] font-bold leading-5 text-white backdrop-blur-sm max-w-md mx-auto">
              {flashActivo ? "Flash de pantalla listo." : "Toma una foto clara del ave."}
            </div>

            <footer className="absolute bottom-[24px] left-0 right-0 z-10 flex items-center justify-between px-8 max-w-md mx-auto">
              <button type="button" onClick={abrirGaleria} className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/50 bg-black/25 text-white backdrop-blur-sm"><FaImage className="h-5 w-5" /></button>
              <button type="button" onClick={tomarFoto} className="h-[72px] w-[72px] rounded-full border-[6px] border-white bg-white/80 shadow-lg ring-4 ring-black/30 active:scale-90 transition-transform" />
              <button type="button" onClick={cambiarCamara} className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/50 bg-black/25 text-white backdrop-blur-sm"><FaRedoAlt className="h-5 w-5" /></button>
            </footer>
          </main>
        )}
        <MenuModulosComp />
      </section>
    </AdaptadoMobil>
  );
}

export default ScanPages;