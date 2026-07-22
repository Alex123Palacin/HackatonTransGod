import { useMemo, useState } from "react";
import VisorImagenesComp from "./VisorImagenesComp";

type MiniExperienciaCompProps = {
  titulo: string;
  descripcion: string;
  imagenes: string[];
};

function MiniExperienciaComp({
  titulo,
  descripcion,
  imagenes,
}: MiniExperienciaCompProps) {
  const [indiceSeleccionado, setIndiceSeleccionado] = useState<number | null>(
    null,
  );
  const imagenesValidas = useMemo(
    () => imagenes.filter((imagen) => imagen.trim().length > 0),
    [imagenes],
  );
  const imagenesMostradas = imagenesValidas.slice(0, 3);
  const imagenesExtra = Math.max(imagenesValidas.length - 3, 0);
  const cantidadMostrada = imagenesMostradas.length;

  const distribucionGaleria =
    cantidadMostrada <= 1
      ? "grid-cols-1 grid-rows-1"
      : cantidadMostrada === 2
        ? "grid-cols-2 grid-rows-1"
        : "grid-cols-2 grid-rows-2";

  return (
    <article className="grid w-full max-w-full grid-cols-[1fr_145px] gap-3 rounded-xl border border-gray-400 bg-white p-3 font-[Arial] shadow-sm [overflow-wrap:normal] [word-break:normal]">
      <div className="min-w-0 [overflow-wrap:normal] [word-break:normal]">
        <h3 className="text-[14px] font-bold leading-4 text-[#006f6c] [overflow-wrap:normal] [word-break:normal]">
          {titulo}
        </h3>
        <p className="mt-2 text-[12px] leading-4 text-gray-600 [overflow-wrap:normal] [word-break:normal]">
          {descripcion}
        </p>
      </div>

      <div
        className={`grid h-[125px] overflow-hidden rounded-md bg-gray-200 ${distribucionGaleria}`}
      >
        {cantidadMostrada === 0 ? (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 px-3 text-center text-[11px] text-gray-500">
            Sin imagenes
          </div>
        ) : (
          imagenesMostradas.map((imagen, indice) => (
            <ImagenExperiencia
              key={`${imagen}-${indice}`}
              src={imagen}
              alt={`${titulo} ${indice + 1}`}
              estilos={cantidadMostrada >= 3 && indice === 0 ? "row-span-2" : ""}
              cantidadExtra={indice === 2 ? imagenesExtra : 0}
              onClick={() => setIndiceSeleccionado(indice)}
            />
          ))
        )}
      </div>

      <VisorImagenesComp
        abierto={indiceSeleccionado !== null}
        imagenes={imagenesValidas}
        indiceInicial={indiceSeleccionado ?? 0}
        titulo={titulo}
        onCerrar={() => setIndiceSeleccionado(null)}
      />
    </article>
  );
}

type ImagenExperienciaProps = {
  src: string;
  alt: string;
  estilos?: string;
  cantidadExtra?: number;
  onClick: () => void;
};

function ImagenExperiencia({
  src,
  alt,
  estilos = "",
  cantidadExtra = 0,
  onClick,
}: ImagenExperienciaProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative h-full min-h-0 w-full min-w-0 cursor-zoom-in overflow-hidden border border-white/70 bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006f6c] ${estilos}`}
      aria-label={`Ampliar ${alt}`}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
      />
      {cantidadExtra > 0 && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[26px] font-bold text-white">
          +{cantidadExtra}
        </span>
      )}
    </button>
  );
}

export default MiniExperienciaComp;
