import type { ComponentType } from "react";
import {
  FaArrowRight,
  FaBullhorn,
  FaClipboardList,
  FaDove,
  FaImages,
} from "react-icons/fa";
import type { DatosAdmin } from "../../api/adminmodulos/tipos";
import { colorEstado, formatearFecha, nombreEstado } from "./estilosAdmin";

type ResumenAdminProps = {
  datos: DatosAdmin;
  irAModulo: (modulo: string) => void;
};

type Metrica = {
  titulo: string;
  valor: number;
  detalle: string;
  modulo: string;
  Icono: ComponentType<{ className?: string }>;
};

function ResumenAdmin({ datos, irAModulo }: ResumenAdminProps) {
  const pendientes = datos.reportes.filter(
    (reporte) => reporte.estado === "PENDIENTE",
  ).length;
  const metricas: Metrica[] = [
    {
      titulo: "Reportes pendientes",
      valor: pendientes,
      detalle: `${datos.reportes.length} reportes registrados`,
      modulo: "reportes",
      Icono: FaClipboardList,
    },
    {
      titulo: "Comunicados activos",
      valor: datos.comunicados.filter((comunicado) => comunicado.activo).length,
      detalle: `${datos.comunicados.length} comunicados en total`,
      modulo: "comunicados",
      Icono: FaBullhorn,
    },
    {
      titulo: "Aves publicadas",
      valor: datos.aves.filter((ave) => ave.activa).length,
      detalle: `${datos.aves.length} especies registradas`,
      modulo: "aves",
      Icono: FaDove,
    },
    {
      titulo: "Publicaciones visibles",
      valor: datos.publicaciones.filter((publicacion) => publicacion.activa).length,
      detalle: `${datos.publicaciones.length} publicaciones recibidas`,
      modulo: "publicaciones",
      Icono: FaImages,
    },
  ];

  return (
    <div className="space-y-7">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricas.map(({ titulo, valor, detalle, modulo, Icono }) => (
          <button
            key={titulo}
            type="button"
            onClick={() => irAModulo(modulo)}
            className="group rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#8dbfb6] hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#e6f3ef] text-[#006f6c]">
                <Icono className="h-5 w-5" />
              </span>
              <FaArrowRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#006f6c]" />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{valor}</p>
            <h2 className="mt-1 text-sm font-bold text-slate-700">{titulo}</h2>
            <p className="mt-1 text-xs text-slate-500">{detalle}</p>
          </button>
        ))}
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-800">Reportes recientes</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Ultimas incidencias registradas
            </p>
          </div>
          <button
            type="button"
            onClick={() => irAModulo("reportes")}
            className="text-sm font-bold text-[#006f6c] hover:underline"
          >
            Ver todos
          </button>
        </header>

        <div className="divide-y divide-slate-100">
          {datos.reportes.slice(0, 5).map((reporte) => (
            <button
              key={reporte.id}
              type="button"
              onClick={() => irAModulo("reportes")}
              className="grid w-full gap-2 px-5 py-4 text-left transition hover:bg-slate-50 sm:grid-cols-[90px_1fr_130px_110px] sm:items-center"
            >
              <span className="text-xs font-bold text-[#006f6c]">
                {reporte.codigo}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-slate-800">
                  {reporte.titulo}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  {reporte.solicitante}
                </span>
              </span>
              <span
                className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${colorEstado[reporte.estado]}`}
              >
                {nombreEstado[reporte.estado]}
              </span>
              <span className="text-xs text-slate-500 sm:text-right">
                {formatearFecha(reporte.fecha)}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ResumenAdmin;
