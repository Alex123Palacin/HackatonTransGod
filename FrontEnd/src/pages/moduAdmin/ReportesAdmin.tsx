import { useMemo, useState } from "react";
import { FaCheck, FaSearch, FaTrash } from "react-icons/fa";
import VisorImagenesComp from "../../components/VisorImagenesComp";
import type {
  EstadoReporteAdmin,
  ReporteAdmin,
} from "../../api/adminmodulos/tipos";
import {
  colorEstado,
  formatearFecha,
  nombreEstado,
} from "./estilosAdmin";

type ReportesAdminProps = {
  reportes: ReporteAdmin[];
  procesando: boolean;
  cambiarEstado: (id: number, estado: EstadoReporteAdmin) => Promise<boolean>;
  borrar: (id: number) => Promise<boolean>;
};

const estados: Array<{ valor: "TODOS" | EstadoReporteAdmin; texto: string }> = [
  { valor: "TODOS", texto: "Todos" },
  { valor: "PENDIENTE", texto: "Pendientes" },
  { valor: "EN_REVISION", texto: "En revision" },
  { valor: "ATENDIDO", texto: "Atendidos" },
  { valor: "RECHAZADO", texto: "Rechazados" },
];

function ReportesAdmin({
  reportes,
  procesando,
  cambiarEstado,
  borrar,
}: ReportesAdminProps) {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<"TODOS" | EstadoReporteAdmin>("TODOS");
  const [seleccionado, setSeleccionado] = useState<number | null>(
    reportes[0]?.id ?? null,
  );
  const [imagenAbierta, setImagenAbierta] = useState(false);

  const filtrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return reportes.filter((reporte) => {
      const coincideEstado = filtro === "TODOS" || reporte.estado === filtro;
      const coincideTexto =
        !termino ||
        [
          reporte.codigo,
          reporte.titulo,
          reporte.solicitante,
          reporte.correoSolicitante,
        ].some((texto) => texto.toLowerCase().includes(termino));
      return coincideEstado && coincideTexto;
    });
  }, [busqueda, filtro, reportes]);

  const detalle = reportes.find((reporte) => reporte.id === seleccionado) ?? null;

  return (
    <div className="grid min-h-0 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-200 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="flex h-10 w-full max-w-[380px] items-center gap-2 rounded-md border border-slate-300 px-3 focus-within:border-[#007d78]">
              <FaSearch className="h-3.5 w-3.5 text-slate-400" />
              <input
                type="search"
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
                placeholder="Buscar por codigo, persona o asunto"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </label>

            <div className="flex max-w-full gap-2 overflow-x-auto pb-1 lg:pb-0">
              {estados.map((estado) => (
                <button
                  key={estado.valor}
                  type="button"
                  onClick={() => setFiltro(estado.valor)}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold transition ${
                    filtro === estado.valor
                      ? "bg-[#006f6c] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {estado.texto}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-bold">Reporte</th>
                <th className="px-4 py-3 font-bold">Solicitante</th>
                <th className="px-4 py-3 font-bold">Estado</th>
                <th className="px-4 py-3 font-bold">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.map((reporte) => (
                <tr
                  key={reporte.id}
                  onClick={() => setSeleccionado(reporte.id)}
                  className={`cursor-pointer transition hover:bg-[#f1f8f6] ${
                    seleccionado === reporte.id ? "bg-[#eef7f4]" : ""
                  }`}
                >
                  <td className="px-4 py-4">
                    <span className="block text-xs font-bold text-[#006f6c]">
                      {reporte.codigo}
                    </span>
                    <span className="mt-1 block max-w-[270px] truncate text-sm font-bold text-slate-800">
                      {reporte.titulo}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {reporte.correoSolicitante}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {reporte.solicitante}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${colorEstado[reporte.estado]}`}
                    >
                      {nombreEstado[reporte.estado]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-500">
                    {formatearFecha(reporte.fecha)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtrados.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-slate-500">
            No hay reportes que coincidan con el filtro.
          </p>
        )}
      </section>

      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-24">
        {detalle ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#006f6c]">
                  {detalle.codigo}
                </span>
                <h2 className="mt-1 text-lg font-bold leading-6 text-slate-900">
                  {detalle.titulo}
                </h2>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ring-inset ${colorEstado[detalle.estado]}`}
              >
                {nombreEstado[detalle.estado]}
              </span>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-slate-100 py-4 text-xs">
              <div>
                <dt className="text-slate-400">Solicitante</dt>
                <dd className="mt-1 font-bold text-slate-700">{detalle.solicitante}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Fecha</dt>
                <dd className="mt-1 font-bold text-slate-700">
                  {formatearFecha(detalle.fecha)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Correo</dt>
                <dd className="mt-1 truncate font-bold text-slate-700">
                  {detalle.correoSolicitante}
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              {detalle.descripcion}
            </p>

            {detalle.imagenUrl && (
              <button
                type="button"
                onClick={() => setImagenAbierta(true)}
                className="mt-4 h-40 w-full cursor-zoom-in overflow-hidden rounded-md bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006f6c]"
                aria-label="Ampliar evidencia del reporte"
              >
                <img
                  src={detalle.imagenUrl}
                  alt={`Evidencia de ${detalle.titulo}`}
                  className="h-full w-full object-cover"
                />
              </button>
            )}

            <label className="mt-5 block">
              <span className="mb-1.5 block text-xs font-bold text-slate-600">
                Cambiar estado
              </span>
              <select
                value={detalle.estado}
                disabled={procesando}
                onChange={(evento) =>
                  void cambiarEstado(
                    detalle.id,
                    evento.target.value as EstadoReporteAdmin,
                  )
                }
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-[#007d78]"
              >
                {estados.slice(1).map((estado) => (
                  <option key={estado.valor} value={estado.valor}>
                    {estado.texto}
                  </option>
                ))}
              </select>
            </label>

            {detalle.estado !== "ATENDIDO" && (
              <button
                type="button"
                disabled={procesando}
                onClick={() => void cambiarEstado(detalle.id, "ATENDIDO")}
                className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#006f6c] px-4 text-sm font-bold text-white hover:bg-[#005a57] disabled:opacity-60"
              >
                <FaCheck className="h-3.5 w-3.5" />
                Marcar como atendido
              </button>
            )}

            <button
              type="button"
              disabled={procesando}
              onClick={() => {
                if (window.confirm("¿Eliminar definitivamente este reporte?")) {
                  void borrar(detalle.id);
                }
              }}
              className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-md border border-red-200 px-4 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              <FaTrash className="h-3.5 w-3.5" />
              Eliminar reporte
            </button>

            <VisorImagenesComp
              abierto={imagenAbierta}
              imagenes={detalle.imagenUrl ? [detalle.imagenUrl] : []}
              titulo={detalle.titulo}
              onCerrar={() => setImagenAbierta(false)}
            />
          </>
        ) : (
          <p className="py-10 text-center text-sm text-slate-500">
            Selecciona un reporte para revisar sus detalles.
          </p>
        )}
      </aside>
    </div>
  );
}

export default ReportesAdmin;
