import { FaInfoCircle } from "react-icons/fa";
import HazReporteComp from "../components/HazReporteComp";
import InofrmacionReporteComp from "../components/InofrmacionReporteComp";

function PaginaReporte() {
  return (
    <section className="flex flex-col gap-4 [overflow-wrap:normal] [word-break:normal]">
      <HazReporteComp />
      <InofrmacionReporteComp />

      <article className="flex items-start gap-3 rounded-[16px] border border-[#b8d7d2] bg-[#dcefeb] px-4 py-3">
        <FaInfoCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#006f6c]" />
        <div className="min-w-0">
          <h3 className="text-[12px] font-bold leading-4 text-[#006f6c]">
            Tu reporte nos ayuda
          </h3>
          <p className="mt-1 text-[10px] leading-4 text-slate-600">
            Tu informacion es importante para mantener nuestro malecon limpio,
            seguro y en buen estado.
          </p>
        </div>
      </article>
    </section>
  );
}

export default PaginaReporte;
