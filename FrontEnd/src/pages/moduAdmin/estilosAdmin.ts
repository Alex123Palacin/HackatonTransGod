import type { EstadoReporteAdmin } from "../../api/adminmodulos/tipos";

const nombreEstado: Record<EstadoReporteAdmin, string> = {
  PENDIENTE: "Pendiente",
  EN_REVISION: "En revision",
  ATENDIDO: "Atendido",
  RECHAZADO: "Rechazado",
};

const colorEstado: Record<EstadoReporteAdmin, string> = {
  PENDIENTE: "bg-amber-50 text-amber-700 ring-amber-200",
  EN_REVISION: "bg-sky-50 text-sky-700 ring-sky-200",
  ATENDIDO: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  RECHAZADO: "bg-red-50 text-red-700 ring-red-200",
};

function formatearFecha(fecha: string) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(anio, mes - 1, dia));
}

export { colorEstado, formatearFecha, nombreEstado };
