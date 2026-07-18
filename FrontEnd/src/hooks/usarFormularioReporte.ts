import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorApi } from "../api/LoginApi/clienteApi";
import { crearReporte } from "../api/NoticiaApi/ReporteApi/reporteApi";

function useFormularioReporte() {
  const navigate = useNavigate();
  const inputImagenRef = useRef<HTMLInputElement | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState<File | undefined>();
  const [vistaPrevia, setVistaPrevia] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!imagen) {
      setVistaPrevia("");
      return;
    }
    const url = URL.createObjectURL(imagen);
    setVistaPrevia(url);
    return () => URL.revokeObjectURL(url);
  }, [imagen]);

  function seleccionarImagen(event: ChangeEvent<HTMLInputElement>) {
    setImagen(event.target.files?.[0]);
    event.target.value = "";
  }

  async function enviarReporte() {
    if (!titulo.trim() || !descripcion.trim()) {
      setError("Completa el titulo y la descripcion.");
      return;
    }

    setEnviando(true);
    setError("");
    try {
      await crearReporte({ titulo, descripcion, imagen });
      navigate("/noticias/verReport", { replace: true });
    } catch (errorDesconocido) {
      setError(
        errorDesconocido instanceof ErrorApi
          ? errorDesconocido.message
          : "No se pudo enviar el reporte.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return {
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    inputImagenRef,
    vistaPrevia,
    seleccionarImagen,
    abrirSelectorImagen: () => inputImagenRef.current?.click(),
    quitarImagen: () => setImagen(undefined),
    enviarReporte,
    enviando,
    error,
  };
}

export { useFormularioReporte };
