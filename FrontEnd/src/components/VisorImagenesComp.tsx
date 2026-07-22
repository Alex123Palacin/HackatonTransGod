import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

type VisorImagenesCompProps = {
  abierto: boolean;
  imagenes: string[];
  indiceInicial?: number;
  titulo: string;
  onCerrar: () => void;
};

function VisorImagenesComp({
  abierto,
  imagenes,
  indiceInicial = 0,
  titulo,
  onCerrar,
}: VisorImagenesCompProps) {
  const [indiceActual, setIndiceActual] = useState(indiceInicial);

  useEffect(() => {
    if (abierto) setIndiceActual(indiceInicial);
  }, [abierto, indiceInicial]);

  useEffect(() => {
    if (!abierto) return;

    function manejarTeclado(evento: KeyboardEvent) {
      if (evento.key === "Escape") onCerrar();
      if (evento.key === "ArrowLeft") {
        setIndiceActual((indice) =>
          indice === 0 ? imagenes.length - 1 : indice - 1,
        );
      }
      if (evento.key === "ArrowRight") {
        setIndiceActual((indice) => (indice + 1) % imagenes.length);
      }
    }

    document.addEventListener("keydown", manejarTeclado);
    return () => document.removeEventListener("keydown", manejarTeclado);
  }, [abierto, imagenes.length, onCerrar]);

  if (!abierto || imagenes.length === 0) return null;

  const hayVariasImagenes = imagenes.length > 1;
  const imagenActual = imagenes[indiceActual] ?? imagenes[0];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Imagenes de ${titulo}`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 font-[Arial]"
      onPointerDown={(evento) => {
        if (evento.target === evento.currentTarget) onCerrar();
      }}
    >
      <button
        type="button"
        onClick={onCerrar}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Cerrar imagen"
      >
        <FaTimes className="h-5 w-5" />
      </button>

      {hayVariasImagenes && (
        <button
          type="button"
          onClick={() =>
            setIndiceActual((indice) =>
              indice === 0 ? imagenes.length - 1 : indice - 1,
            )
          }
          className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Imagen anterior"
        >
          <FaChevronLeft className="h-5 w-5" />
        </button>
      )}

      <figure className="flex max-h-[88dvh] w-full max-w-4xl flex-col items-center gap-3 px-10">
        <img
          src={imagenActual}
          alt={`${titulo}, imagen ${indiceActual + 1}`}
          className="max-h-[78dvh] max-w-full rounded-md object-contain shadow-2xl"
        />
        {hayVariasImagenes && (
          <figcaption className="rounded-full bg-black/50 px-3 py-1 text-[12px] font-bold text-white">
            {indiceActual + 1} de {imagenes.length}
          </figcaption>
        )}
      </figure>

      {hayVariasImagenes && (
        <button
          type="button"
          onClick={() =>
            setIndiceActual((indice) => (indice + 1) % imagenes.length)
          }
          className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Imagen siguiente"
        >
          <FaChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>,
    document.body,
  );
}

export default VisorImagenesComp;
