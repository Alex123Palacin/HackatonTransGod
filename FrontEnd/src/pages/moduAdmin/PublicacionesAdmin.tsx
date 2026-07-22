import { useState } from "react";
import { FaEye, FaEyeSlash, FaImages, FaTrash } from "react-icons/fa";
import VisorImagenesComp from "../../components/VisorImagenesComp";
import type { PublicacionAdmin } from "../../api/adminmodulos/tipos";
import { formatearFecha } from "./estilosAdmin";

type PublicacionesAdminProps = {
  publicaciones: PublicacionAdmin[];
  procesando: boolean;
  alternar: (id: number) => Promise<boolean>;
  borrar: (id: number) => Promise<boolean>;
};

function PublicacionesAdmin({
  publicaciones,
  procesando,
  alternar,
  borrar,
}: PublicacionesAdminProps) {
  const [visor, setVisor] = useState<PublicacionAdmin | null>(null);

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="font-bold text-slate-800">Moderacion de publicaciones</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Revisa el contenido compartido por visitantes
          </p>
        </div>
        <span className="rounded-full bg-[#edf7f4] px-3 py-1.5 text-xs font-bold text-[#006f6c]">
          {publicaciones.length} registros
        </span>
      </header>

      <div className="divide-y divide-slate-100">
        {publicaciones.map((publicacion) => (
          <article
            key={publicacion.id}
            className="grid gap-4 px-5 py-5 md:grid-cols-[88px_minmax(0,1fr)_120px_auto] md:items-center"
          >
            <div className="flex h-[72px] w-[88px] items-center justify-center overflow-hidden rounded-md bg-[#e6f3ef] text-[#006f6c]">
              {publicacion.imagenUrl ? (
                <button
                  type="button"
                  onClick={() => setVisor(publicacion)}
                  className="group relative h-full w-full cursor-zoom-in overflow-hidden"
                  aria-label={`Ver imagenes de ${publicacion.titulo}`}
                >
                  <img
                    src={publicacion.imagenUrl}
                    alt=""
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  {publicacion.imagenes.length > 1 && (
                    <span className="absolute bottom-1 right-1 rounded bg-black/65 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      +{publicacion.imagenes.length - 1}
                    </span>
                  )}
                </button>
              ) : (
                <FaImages className="h-6 w-6" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-sm font-bold text-slate-800">
                  {publicacion.titulo}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    publicacion.activa
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {publicacion.activa ? "Publicada" : "Oculta"}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                {publicacion.descripcion}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Por {publicacion.autor} · {publicacion.correoAutor}
              </p>
            </div>

            <span className="text-xs text-slate-500">
              {formatearFecha(publicacion.fecha)}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                title={publicacion.activa ? "Ocultar" : "Publicar"}
                aria-label={
                  publicacion.activa ? "Ocultar publicacion" : "Publicar contenido"
                }
                disabled={procesando}
                onClick={() => void alternar(publicacion.id)}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-[#006f6c] hover:bg-[#edf7f4] disabled:opacity-50"
              >
                {publicacion.activa ? <FaEyeSlash /> : <FaEye />}
              </button>
              <button
                type="button"
                title="Eliminar"
                aria-label="Eliminar publicacion"
                disabled={procesando}
                onClick={() => {
                  if (window.confirm("¿Eliminar esta publicacion?")) {
                    void borrar(publicacion.id);
                  }
                }}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <FaTrash className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>
        ))}

        {publicaciones.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-slate-500">
            No hay publicaciones para moderar.
          </p>
        )}
      </div>

      <VisorImagenesComp
        abierto={visor !== null}
        imagenes={visor?.imagenes ?? []}
        titulo={visor?.titulo ?? "Publicacion"}
        onCerrar={() => setVisor(null)}
      />
    </section>
  );
}

export default PublicacionesAdmin;
