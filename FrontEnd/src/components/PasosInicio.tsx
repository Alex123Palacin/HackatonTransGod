type PasosInicioProps = {
  numero: number | string;
  titulo: string;
  descripcion: string;
  estilos?: string;
};

function PasosInicio({
  numero,
  titulo,
  descripcion,
  estilos = "",
}: PasosInicioProps) {
  return (
    <article
      className={`flex w-full max-w-[230px] items-center gap-3 rounded-xl border border-gray-300 bg-white px-3 py-2 shadow-sm ${estilos}`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-800 font-[Arial] text-sm font-bold text-white">
        {numero}
      </div>

      <div>
        <h3 className="font-[Arial] text-sm font-bold leading-4 text-teal-800">
          {titulo}
        </h3>
        <p className="mt-1 font-[Arial] text-[9px] leading-3 text-gray-500">
          {descripcion}
        </p>
      </div>
    </article>
  );
}

export default PasosInicio;
