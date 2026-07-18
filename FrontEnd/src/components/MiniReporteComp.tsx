import { FaClipboardCheck } from "react-icons/fa";
import type { ReporteApi } from "../api/NoticiaApi/ReporteApi/tipos";

const nombresEstado: Record<ReporteApi["estado"], string> = {
  PENDIENTE: "Pendiente",
  EN_REVISION: "En revision",
  ATENDIDO: "Atendido",
  RECHAZADO: "Rechazado",
};

const formateadorFecha = new Intl.DateTimeFormat("es-PE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function MiniReporteComp({ reporte }: { reporte: ReporteApi }) {
  const fecha = formateadorFecha.format(new Date(`${reporte.fecha}T00:00:00`));

  return (
    <article className="overflow-hidden rounded-[16px] bg-white shadow-sm">
      {reporte.imagen && (
        <img
          src={reporte.imagen}
          alt={reporte.titulo}
          className="h-32 w-full object-cover"
        />
      )}
      <div className="flex items-start gap-3 px-4 py-4">
        <FaClipboardCheck className="mt-0.5 h-7 w-7 shrink-0 text-[#006f6c]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-[13px] font-bold leading-4 text-[#006f6c]">
              {reporte.titulo}
            </h2>
            <span className="shrink-0 rounded-full bg-[#e4f3ed] px-2 py-1 text-[9px] font-bold text-[#006f6c]">
              {nombresEstado[reporte.estado]}
            </span>
          </div>
          <p className="mt-2 text-[11px] leading-4 text-slate-600">
            {reporte.descripcion}
          </p>
          <time className="mt-2 block text-[10px] text-slate-400">{fecha}</time>
        </div>
      </div>
    </article>
  );
}

export default MiniReporteComp;
