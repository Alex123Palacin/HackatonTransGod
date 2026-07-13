type PorcentajeAveCompProps = {
  encontradas: number;
  total: number;
  porcentaje: number;
};

function PorcentajeAveComp({
  encontradas,
  total,
  porcentaje,
}: PorcentajeAveCompProps) {
  const porcentajeSeguro = Math.max(0, Math.min(100, porcentaje));

  return (
    <section className="rounded-[22px] bg-white px-6 py-5 font-[Arial] shadow-sm [overflow-wrap:normal] [word-break:normal]">
      <p className="text-[17px] text-[#006f6c] [overflow-wrap:normal] [word-break:normal]">
        {encontradas} de {total} aves encontradas
      </p>

      <div className="mt-4 flex items-center gap-4">
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-gray-300">
          <div
            className="h-full rounded-full bg-[#4e965e]"
            style={{ width: `${porcentajeSeguro}%` }}
          />
        </div>
        <strong className="text-[24px] leading-none text-[#006f6c]">
          {porcentajeSeguro}%
        </strong>
      </div>
    </section>
  );
}

export default PorcentajeAveComp;
