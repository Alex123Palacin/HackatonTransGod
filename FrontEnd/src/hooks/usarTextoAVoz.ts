import { useCallback, useEffect, useRef, useState } from "react";

function limpiarTextoParaLectura(texto: string) {
  return texto
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*_#`>~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function seleccionarVozEspanol(voces: SpeechSynthesisVoice[]) {
  return (
    voces.find((voz) => voz.lang.toLowerCase() === "es-pe") ??
    voces.find((voz) => voz.lang.toLowerCase().startsWith("es")) ??
    null
  );
}

function useTextoAVoz(activo: boolean) {
  const [hablando, setHablando] = useState(false);
  const activoRef = useRef(activo);
  const lecturaRef = useRef<SpeechSynthesisUtterance | null>(null);
  const compatible =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

  const detener = useCallback(() => {
    if (!compatible) return;
    lecturaRef.current = null;
    window.speechSynthesis.cancel();
    setHablando(false);
  }, [compatible]);

  const hablar = useCallback(
    (texto: string) => {
      if (!activoRef.current || !compatible) return;

      const textoLimpio = limpiarTextoParaLectura(texto);
      if (!textoLimpio) return;

      window.speechSynthesis.cancel();
      const lectura = new SpeechSynthesisUtterance(textoLimpio);
      const voz = seleccionarVozEspanol(window.speechSynthesis.getVoices());
      lectura.lang = voz?.lang ?? "es-PE";
      lectura.rate = 1;
      lectura.pitch = 1;
      if (voz) lectura.voice = voz;

      lecturaRef.current = lectura;
      lectura.onend = () => {
        if (lecturaRef.current !== lectura) return;
        lecturaRef.current = null;
        setHablando(false);
      };
      lectura.onerror = () => {
        if (lecturaRef.current !== lectura) return;
        lecturaRef.current = null;
        setHablando(false);
      };

      setHablando(true);
      window.speechSynthesis.speak(lectura);
    },
    [compatible],
  );

  useEffect(() => {
    activoRef.current = activo;
    if (!activo) detener();
  }, [activo, detener]);

  useEffect(() => detener, [detener]);

  return { compatible, detener, hablando, hablar };
}

export { useTextoAVoz };
