import type { ComponentType } from "react";
import {
  FaCompass,
  FaDroplet,
  FaLeaf,
  FaLocationDot,
  FaRegCircleQuestion,
  FaSeedling,
} from "react-icons/fa6";

type ChipDetalle = {
  texto: string;
  tipo?: "agua" | "verde" | "simple";
};

type ItemDetalle = {
  titulo: string;
  descripcion: string;
  icono?: ComponentType<{ className?: string }>;
};

type CararteristicasDetalleCompProps = {
  chips?: ChipDetalle[];
  detalles: ItemDetalle[];
};

const iconosPorDefecto = [
  FaCompass,
  FaSeedling,
  FaLocationDot,
  FaRegCircleQuestion,
];

function CararteristicasDetalleComp({
  chips = [],
  detalles,
}: CararteristicasDetalleCompProps) {
  return (
    <section className="flex flex-col gap-3 [overflow-wrap:normal] [word-break:normal]">
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span
            key={chip.texto}
            className={`flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-bold ${
              chip.tipo === "agua"
                ? "border-[#b7d5f5] bg-[#eef7ff] text-[#2874a6]"
                : chip.tipo === "verde"
                  ? "border-[#b9dfc4] bg-[#edf8ef] text-[#277a44]"
                  : "border-gray-200 bg-white text-slate-700"
            }`}
          >
            {chip.tipo === "agua" && <FaDroplet className="h-3 w-3" />}
            {chip.tipo === "verde" && <FaLeaf className="h-3 w-3" />}
            {chip.texto}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {detalles.map((detalle, index) => {
          const Icono =
            detalle.icono ?? iconosPorDefecto[index % iconosPorDefecto.length];

          return (
            <article key={detalle.titulo} className="flex gap-2.5">
              <Icono className="mt-1 h-3.5 w-3.5 shrink-0 text-[#006f6c]" />
              <div className="min-w-0">
                <h3 className="text-[13px] font-bold leading-4 text-[#006f6c]">
                  {detalle.titulo}
                </h3>
                <p className="text-[11px] leading-4 text-slate-600">
                  {detalle.descripcion}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default CararteristicasDetalleComp;
export type { ChipDetalle, ItemDetalle };
