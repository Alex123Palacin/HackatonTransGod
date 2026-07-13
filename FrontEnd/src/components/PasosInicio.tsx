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
      className={`flex w-full max-w-full items-center gap-4 rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm ${estilos}`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#006f6c] font-[Arial] text-base font-bold text-white">
        {numero}
      </div>

      <div className="min-w-0 [overflow-wrap:normal] [word-break:normal]">
        <h3 className="font-[Arial] text-base font-bold leading-4 text-[#006f6c] [overflow-wrap:normal] [word-break:normal]">
          {titulo}
        </h3>
        <p className="mt-1 font-[Arial] text-[11px] leading-4 text-gray-500 [overflow-wrap:normal] [word-break:normal]">
          {descripcion}
        </p>
      </div>
    </article>
  );
}

export default PasosInicio;
