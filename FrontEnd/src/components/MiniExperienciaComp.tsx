type MiniExperienciaCompProps = {
  titulo?: string;
  descripcion?: string;
  imagenes?: string[];
};

function MiniExperienciaComp({
  titulo = "Un dia en familia",
  descripcion = "Disfrutamos de una tranquila caminata junto al mar, rodeados de naturaleza y compartiendo un momento especial en familia.",
  imagenes = [],
}: MiniExperienciaCompProps) {
  const imagenesMostradas = imagenes.slice(0, 3);
  const imagenesExtra = Math.max(imagenes.length - 3, 0);

  return (
    <article className="grid w-full max-w-[350px] grid-cols-[1fr_188px] gap-4 rounded-xl border border-gray-400 bg-white p-3 font-[Arial] shadow-sm">
      <div>
        <h3 className="text-[16px] font-bold leading-5 text-[#006f6c]">
          {titulo}
        </h3>
        <p className="mt-2 text-[14px] leading-4 text-gray-600">
          {descripcion}
        </p>
      </div>

      <div className="grid h-[150px] grid-cols-2 grid-rows-2 overflow-hidden">
        <ImagenExperiencia
          src={imagenesMostradas[0]}
          alt={`${titulo} 1`}
          estilos="row-span-2"
        />
        <ImagenExperiencia src={imagenesMostradas[1]} alt={`${titulo} 2`} />
        <div className="relative">
          <ImagenExperiencia src={imagenesMostradas[2]} alt={`${titulo} 3`} />
          {imagenesExtra > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-[28px] font-bold text-white">
              +{imagenesExtra}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

type ImagenExperienciaProps = {
  src?: string;
  alt: string;
  estilos?: string;
};

function ImagenExperiencia({ src, alt, estilos = "" }: ImagenExperienciaProps) {
  if (!src) {
    return <div className={`h-full w-full bg-gray-300 ${estilos}`} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`h-full w-full object-cover ${estilos}`}
    />
  );
}

export default MiniExperienciaComp;
