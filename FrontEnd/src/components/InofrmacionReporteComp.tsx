import type { ComponentType } from "react";
import {
  FaBroom,
  FaChevronRight,
  FaRegCommentDots,
  FaShieldAlt,
  FaTools,
} from "react-icons/fa";
import { useRedireccion } from "../hooks/redireccion";

type TipoReporte = {
  id: number;
  titulo: string;
  descripcion: string;
  Icono: ComponentType<{ className?: string }>;
  ruta: string;
};

const tiposReporte: TipoReporte[] = [
  {
    id: 1,
    titulo: "Queja",
    descripcion: "Inconvenientes con el servicio, atencion o convivencia.",
    Icono: FaRegCommentDots,
    ruta: "/reporte/quejas",
  },
  {
    id: 2,
    titulo: "Mantenimiento",
    descripcion: "Daños en infraestructura, mobiliario o areas comunes.",
    Icono: FaTools,
    ruta: "/reporte/quejas",
  },
  {
    id: 3,
    titulo: "Limpieza",
    descripcion: "Problemas de limpieza en areas comunes o malecon.",
    Icono: FaBroom,
    ruta: "/reporte/quejas",
  },
  {
    id: 4,
    titulo: "Seguridad",
    descripcion: "Situaciones de riesgo o problemas de seguridad.",
    Icono: FaShieldAlt,
    ruta: "/reporte/quejas",
  },
];

function InofrmacionReporteComp() {
  const { redirigir } = useRedireccion();

  return (
    <section className="[overflow-wrap:normal] [word-break:normal]">
      <h2 className="mb-3 px-1 text-[13px] font-bold text-[#006f6c]">
        ¿Que puedes reportar?
      </h2>

      <div className="overflow-hidden rounded-[16px] border border-gray-200 bg-white shadow-sm">
        {tiposReporte.map(({ id, titulo, descripcion, Icono, ruta }) => (
          <button
            key={id}
            type="button"
            onClick={() => redirigir(ruta)}
            className="flex w-full items-center gap-3 border-b border-gray-100 px-3 py-3 text-left last:border-b-0"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e4f3ed] text-[#006f6c]">
              <Icono className="h-5 w-5" />
            </span>

            <span className="min-w-0 flex-1">
              <strong className="block text-[12px] leading-4 text-[#006f6c]">
                {titulo}
              </strong>
              <span className="mt-0.5 block text-[10px] leading-4 text-slate-600">
                {descripcion}
              </span>
            </span>

            <FaChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          </button>
        ))}
      </div>
    </section>
  );
}

export default InofrmacionReporteComp;
