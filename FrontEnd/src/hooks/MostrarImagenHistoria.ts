import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

type ImagenHistoria = {
  id: string;
  nombre: string;
  url: string;
};

function useMostrarImagenHistoria() {
  const inputImagenesRef = useRef<HTMLInputElement | null>(null);
  const imagenesRef = useRef<ImagenHistoria[]>([]);
  const [imagenes, setImagenes] = useState<ImagenHistoria[]>([]);

  useEffect(() => {
    imagenesRef.current = imagenes;
  }, [imagenes]);

  useEffect(() => {
    return () => {
      imagenesRef.current.forEach((imagen) => URL.revokeObjectURL(imagen.url));
    };
  }, []);

  function abrirSelectorImagenes() {
    inputImagenesRef.current?.click();
  }

  function mostrarImagenes(event: ChangeEvent<HTMLInputElement>) {
    const archivos = Array.from(event.target.files ?? []);

    const nuevasImagenes = archivos.map((archivo, index) => ({
      id: `${archivo.name}-${archivo.lastModified}-${index}-${Date.now()}`,
      nombre: archivo.name,
      url: URL.createObjectURL(archivo),
    }));

    setImagenes((imagenesActuales) => [...imagenesActuales, ...nuevasImagenes]);
    event.target.value = "";
  }

  function limpiarImagenes() {
    imagenesRef.current.forEach((imagen) => URL.revokeObjectURL(imagen.url));
    setImagenes([]);
  }

  return {
    imagenes,
    inputImagenesRef,
    abrirSelectorImagenes,
    mostrarImagenes,
    limpiarImagenes,
  };
}

export { useMostrarImagenHistoria };
export type { ImagenHistoria };
