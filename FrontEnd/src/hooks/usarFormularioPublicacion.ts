import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorApi } from "../api/LoginApi/clienteApi";
import { crearPublicacion } from "../api/NoticiaApi/PublicacionApi/publicacionApi";
import type { HistoriaFormulario } from "../components/FormularioHistoriaComp";

function useFormularioPublicacion() {
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  async function publicar(historia: HistoriaFormulario) {
    if (!historia.titulo.trim() || !historia.descripcion.trim()) {
      setError("Completa el titulo y la descripcion.");
      return;
    }
    if (historia.imagenes.length === 0) {
      setError("Selecciona al menos una imagen.");
      return;
    }

    setEnviando(true);
    setError("");
    try {
      await crearPublicacion({
        titulo: historia.titulo,
        descripcion: historia.descripcion,
        imagenes: historia.imagenes.map((imagen) => imagen.archivo),
      });
      navigate("/noticias?seccion=publicaciones", { replace: true });
    } catch (errorDesconocido) {
      setError(
        errorDesconocido instanceof ErrorApi
          ? errorDesconocido.message
          : "No se pudo publicar la historia.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return { publicar, enviando, error };
}

export { useFormularioPublicacion };
